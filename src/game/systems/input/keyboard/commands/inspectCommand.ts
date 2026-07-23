import { getBackpack, getContainerSize } from "../../../../model/queries/containers";
import { getEq } from "../../../../model/queries/eq";
import { getPlayerEntity } from "../../../../model/queries/player";
import type { EqSlot } from "../../../eq/types";
import type { InvSlot } from "../../../containers/types";
import { PlayerActionType } from "../../../player/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";
import { createSlotActionCommands } from "./slots";

const getInspectInvCommand = (invSize: number): KeyboardToAction => {
  return createSlotActionCommands<InvSlot>(invSize, (slot) => ({
    type: PlayerActionType.INSPECT_INV,
    invSlot: slot,
  }));
};

const getInspectEqCommand = (eqSize: number): KeyboardToAction => {
  return createSlotActionCommands<EqSlot>(eqSize, (slot) => ({
    type: PlayerActionType.INSPECT_EQ,
    eqSlot: slot,
  }));
};

const getInspectNextCommand = (): KeyboardToAction => {
  const player = getPlayerEntity();
  const backpack = getBackpack(player);
  if (!backpack) {
    throw new Error("No player backpack");
  }
  const backpackSize = getContainerSize(backpack);
  const eqSlotsCount = getEq(player).length;

  return {
    "1": {
      next: () => getInspectInvCommand(backpackSize),
      message: `Select INV item to inspect (1-${backpackSize})`,
      fallback: "Invalid INV slot",
    },
    "2": {
      next: () => getInspectEqCommand(eqSlotsCount),
      message: `Select EQ slot to inspect (1-${eqSlotsCount})`,
      fallback: "Invalid EQ slot",
    },
  };
};

export const getInspectCommand = (): KeyboardToActionCommand => {
  return {
    next: () => getInspectNextCommand(),
    message: `Inspect what (1 for INV, 2 for EQ)`,
    fallback: "Invalid source",
  };
};
