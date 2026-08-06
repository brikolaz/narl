import { UI_STATE } from "../../../render/state/state";
import { PlayerActionType } from "../../../systems/player/types";
import type { KeyboardToActionCommand } from "../chain";
import { EQ_SLOTS, getAdjacentSlotActions } from "./slots";

export const getUnequipCommand = (): KeyboardToActionCommand => {
  return {
    action: () =>
      getAdjacentSlotActions(
        (eqSlot) => ({
          type: PlayerActionType.UNEQUIP_ITEM,
          eqSlot,
        }),
        UI_STATE.highlights.eqSlot,
        EQ_SLOTS,
      ),
    message: `Select EQ slot to unequip (arrow keys, space to confirm)`,
    fallback: "Invalid direction",
    cleanup: () => {
      UI_STATE.highlights.eqSlot.resetHighlightedSlot();
    },
  };
};
