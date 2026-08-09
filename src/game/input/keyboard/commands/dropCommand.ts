import { getPlayer } from "../../../model/queries/player";
import { getPosition } from "../../../model/queries/position";
import { INV_SLOTS } from "../../../render/state/slots";
import { UI_STATE } from "../../../render/state/state";
import {
  PlayerActionType,
  PlayerDropItemActionReason,
} from "../../../systems/player/types";
import type { KeyboardToActionCommand } from "../chain";
import { getAdjacentSlotActions } from "./slots";

const getDropActionCommands = () => {
  return getAdjacentSlotActions(
    (invSlot) => {
      UI_STATE.highlights.invSlot.resetHighlightedSlot();

      return {
        type: PlayerActionType.DROP_ITEM,
        invSlot,
        eqSlot: undefined,
        targetPosition: getPosition(getPlayer()),
        reason: PlayerDropItemActionReason.MANUAL,
      };
    },
    UI_STATE.highlights.invSlot,
    INV_SLOTS,
  );
};

export const getDropCommand = (): KeyboardToActionCommand => {
  return {
    action: () => getDropActionCommands(),
    message: `Select an item to drop (arrow keys, space to confirm)`,
    fallback: "Invalid item",
    cleanup: () => {
      UI_STATE.highlights.invSlot.resetHighlightedSlot();
    },
  };
};
