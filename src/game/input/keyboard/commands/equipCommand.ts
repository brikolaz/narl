import { UI_STATE } from "../../../render/state/state";
import type { EqSlot, InvSlot } from "../../../render/state/types";
import { PlayerActionType } from "../../../systems/player/types";
import type { KeyboardToActionCommand } from "../chain";
import { EQ_SLOTS, getAdjacentSlotActions, INV_SLOTS } from "./slots";

export const getEquipCommand = (): KeyboardToActionCommand[] => {
  let invSlot: InvSlot;

  return [
    {
      action: () => {
        return getAdjacentSlotActions(
          (slot: InvSlot) => {
            invSlot = slot;
          },
          UI_STATE.highlights.invSlot,
          INV_SLOTS,
        );
      },
      message: `Select item to equip (arrows to move, space to accept)`,
      fallback: "Invalid direction",
      cleanup: () => {
        UI_STATE.highlights.invSlot.resetHighlightedSlot();
      },
    },
    {
      action: () => {
        return getAdjacentSlotActions(
          (slot: EqSlot) => ({
            type: PlayerActionType.EQUIP_ITEM,
            invSlot,
            eqSlot: slot,
          }),
          UI_STATE.highlights.eqSlot,
          EQ_SLOTS,
        );
      },
      message: `Select target slot (arrows to move, space to accept)`,
      fallback: "Invalid direction",
      cleanup: () => {
        UI_STATE.highlights.eqSlot.resetHighlightedSlot();
      },
    },
  ];
};
