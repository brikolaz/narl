import { getPlayer } from "../../../systems/player/player"
import { getPosition } from "../../../systems/position/position"
import { INV_SLOTS } from "../../../render/state/slots"
import { UI_STATE } from "../../../render/state/state"
import {
  PlayerActionTypeEnum,
  PlayerDropItemActionReasonEnum,
} from "../../../systems/player/types"
import type { KeyboardToActionCommand } from "../chain"
import { getAdjacentSlotActions } from "./slots"

const getDropActionCommands = () => {
  return getAdjacentSlotActions(
    (invSlot) => {
      UI_STATE.highlights.invSlot.resetHighlightedSlot()

      return {
        type: PlayerActionTypeEnum.PLAYER_DROP_ITEM,
        invSlot,
        eqSlot: undefined,
        targetPosition: getPosition(getPlayer()),
        reason: PlayerDropItemActionReasonEnum.MANUAL,
      }
    },
    UI_STATE.highlights.invSlot,
    INV_SLOTS,
  )
}

export const getDropCommand = (): KeyboardToActionCommand => {
  return {
    action: () => getDropActionCommands(),
    message: `Select an item to drop (arrow keys, space to confirm)`,
    fallback: "Invalid item",
    cleanup: () => {
      UI_STATE.highlights.invSlot.resetHighlightedSlot()
    },
  }
}
