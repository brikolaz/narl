import { UI_STATE } from "../../../render/state/state";
import { INV_SLOTS, type InvSlot } from "../../../render/state/slots";
import { PlayerActionType } from "../../../systems/player/types";
import type { KeyboardToActionCommand } from "../chain";
import { getAdjacentSlotActions } from "./slots";

export const getMoveItemCommand = (): KeyboardToActionCommand[] => {
  let sourceSlot: InvSlot;
  return [
    {
      action: () => {
        return getAdjacentSlotActions(
          (slot: InvSlot) => {
            sourceSlot = slot;
          },
          UI_STATE.highlights.invSlot,
          INV_SLOTS,
        );
      },
      message: `Select source (arrows to move, space to accept)`,
      fallback: "Invalid direction",
      cleanup: () => {
        UI_STATE.highlights.invSlot.resetHighlightedSlot();
      },
    },
    {
      action: () => {
        return getAdjacentSlotActions(
          (slot: InvSlot) => ({
            type: PlayerActionType.MOVE_ITEM,
            fromSlot: sourceSlot,
            toSlot: slot,
          }),
          UI_STATE.highlights.invSlot,
          INV_SLOTS,
        );
      },
      message: `Select target (arrows to move, space to accept)`,
      fallback: "Invalid direction",
      cleanup: () => {
        UI_STATE.highlights.invSlot.resetHighlightedSlot();
      },
    },
  ];
};
