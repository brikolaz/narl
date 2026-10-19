import { UI_STATE } from "../../../render/state/state"
import { EQ_SLOTS } from "../../../render/state/slots"
import { PlayerActionTypeEnum } from "../../../systems/player/types"
import type { KeyboardToActionCommand } from "../chain"
import { getAdjacentSlotActions } from "./slots"

export const getUnequipCommand = (): KeyboardToActionCommand => {
  return {
    action: () =>
      getAdjacentSlotActions(
        (eqSlot) => {
          UI_STATE.highlights.eqSlot.resetHighlightedSlot()

          return {
            type: PlayerActionTypeEnum.PLAYER_UNEQUIP_ITEM,
            eqSlot,
          }
        },
        UI_STATE.highlights.eqSlot,
        EQ_SLOTS,
      ),
    message: "INPUT.UNEQUIP",
    fallback: "INPUT.INVALID_DIRECTION",
    cleanup: () => {
      UI_STATE.highlights.eqSlot.resetHighlightedSlot()
    },
  }
}
