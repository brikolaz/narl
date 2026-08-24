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
      message: `Select source (arrow keys, space to accept)`,
      fallback: "Invalid direction",
      cleanup: () => {
        UI_STATE.highlights.invSlot.resetHighlightedSlot();
      },
    },
    {
      action: () => {
        return getAdjacentSlotActions(
          (slot: InvSlot) => {
            UI_STATE.highlights.invSlot.resetHighlightedSlot();

            return {
              type: PlayerActionType.MOVE_ITEM,
              fromSlot: sourceSlot,
              toSlot: slot,
            };
          },
          UI_STATE.highlights.invSlot,
          INV_SLOTS,
        );
      },
      message: `Select target (arrow keys, space to accept)`,
      fallback: "Invalid direction",
    },
  ];
};
