import { UI_STATE } from "../../../render/state/state"
import { INV_SLOTS, type InvSlot } from "../../../render/state/slots"
import { PlayerActionTypeEnum } from "../../../systems/player/types"
import type { KeyboardToActionCommand } from "../chain"
import { getAdjacentSlotActions } from "./slots"

export const getEquipCommand = (): KeyboardToActionCommand => {
  return {
    action: () => {
      return getAdjacentSlotActions(
        (invSlot: InvSlot) => {
          UI_STATE.highlights.invSlot.resetHighlightedSlot()

          return {
            type: PlayerActionTypeEnum.PLAYER_EQUIP_ITEM,
            invSlot,
          }
        },
        UI_STATE.highlights.invSlot,
        INV_SLOTS,
      )
    },
    message: `Select item to equip (arrow keys, space to accept)`,
    fallback: "Invalid direction",
    cleanup: () => {
      UI_STATE.highlights.invSlot.resetHighlightedSlot()
    },
  }
}
