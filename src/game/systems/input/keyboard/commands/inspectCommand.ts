import { getPlayerEntity } from "../../../../model/queries/player";
import type { GameState } from "../../../../state/state";
import { getEqSlots } from "../../../../model/queries/eq";
import type { EqSlot } from "../../../eq/types";
import { getBackpack, getContainerSize } from "../../../../model/queries/containers";
import type { InvSlot } from "../../../inv/types";
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

const getInspectNextCommand = (
  gameState: GameState,
): KeyboardToAction => {
  const player = getPlayerEntity(gameState);
  const backpack = getBackpack(player);
  if (!backpack) {
    throw new Error("No player backpack");
  }
  const backpackSize = getContainerSize(backpack);
  const eqSlotsCount = getEqSlots(player).length;

  return {
    "1": {
      next: () => getInspectInvCommand(backpackSize),
      message: `Select INV item to inspect (1-${backpackSize})`,
      fallback: "Invalid INV slot",
    },
    "2": {
      next: () => getInspectEqCommand(eqSlotsCount),
      message: `Select EQ item to inspect (1-${eqSlotsCount})`,
      fallback: "Invalid EQ slot",
    },
  };
};

export const getInspectCommand = (
  gameState: GameState,
): KeyboardToActionCommand => {
  return {
    next: () => getInspectNextCommand(gameState),
    message: `Inspect what (1 for INV, 2 for EQ)`,
    fallback: "Invalid source",
  };
};
