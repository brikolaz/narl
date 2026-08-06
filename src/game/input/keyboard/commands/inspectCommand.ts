import {
  getBackpack,
  getContainerSize,
} from "../../../model/queries/containers";
import { getEq } from "../../../model/queries/eq";
import { getPlayerEntity } from "../../../model/queries/player";
import { UI_STATE } from "../../../render/state/state";
import type { EqSlot, InvSlot } from "../../../render/state/types";
import { PlayerActionType } from "../../../systems/player/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";
import { EQ_SLOTS, getAdjacentSlotActions, INV_SLOTS } from "./slots";

const getSourceCommands = (): KeyboardToAction => {
  const player = getPlayerEntity();
  const backpack = getBackpack(player);
  if (!backpack) {
    throw new Error("No player backpack");
  }
  const backpackSize = getContainerSize(backpack);
  const eqSlotsCount = getEq(player).length;

  return {
    Digit1: {
      action: () => {
        return getAdjacentSlotActions(
          (slot: InvSlot) => ({
            type: PlayerActionType.INSPECT_INV,
            invSlot: slot,
          }),
          UI_STATE.highlights.invSlot,
          INV_SLOTS,
        );
      },
      message: `Select INV item to inspect (1-${backpackSize})`,
      fallback: "Invalid INV slot",
      cleanup: () => {
        UI_STATE.highlights.invSlot.resetHighlightedSlot();
      },
    },
    Digit2: {
      action: () => {
        return getAdjacentSlotActions(
          (slot: EqSlot) => ({
            type: PlayerActionType.INSPECT_EQ,
            eqSlot: slot,
          }),
          UI_STATE.highlights.eqSlot,
          EQ_SLOTS,
        );
      },
      message: `Select EQ slot to inspect (1-${eqSlotsCount})`,
      fallback: "Invalid EQ slot",
      cleanup: () => {
        UI_STATE.highlights.eqSlot.resetHighlightedSlot();
      },
    },
  };
};

export const getInspectCommand = (): KeyboardToActionCommand => {
  return {
    action: () => getSourceCommands(),
    message: `Inspect what (1 for INV, 2 for EQ)`,
    fallback: "Invalid source",
  };
};
