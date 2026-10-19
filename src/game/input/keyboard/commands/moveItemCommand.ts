import { UI_STATE } from "../../../render/state/state"
import { INV_SLOTS, type InvSlot } from "../../../render/state/slots"
import { PlayerActionTypeEnum } from "../../../systems/player/types"
import type { KeyboardToActionCommand } from "../chain"
import { getAdjacentSlotActions } from "./slots"

export const getMoveItemCommand = (): KeyboardToActionCommand[] => {
  let sourceSlot: InvSlot
  return [
    {
      action: () => {
        UI_STATE.highlights.invSlot.setCommandStage(1)

        return getAdjacentSlotActions(
          (slot: InvSlot) => {
            sourceSlot = slot
          },
          UI_STATE.highlights.invSlot,
          INV_SLOTS,
        )
      },
      message: "INPUT.MOVE_SOURCE",
      fallback: "INPUT.INVALID_DIRECTION",
      cleanup: () => {
        UI_STATE.highlights.invSlot.resetHighlightedSlot()
      },
    },
    {
      action: () => {
        UI_STATE.highlights.invSlot.setCommandStage(2)

        return getAdjacentSlotActions(
          (slot: InvSlot) => {
            UI_STATE.highlights.invSlot.resetHighlightedSlot()

            return {
              type: PlayerActionTypeEnum.PLAYER_MOVE_ITEM,
              fromSlot: sourceSlot,
              toSlot: slot,
            }
          },
          UI_STATE.highlights.invSlot,
          INV_SLOTS,
        )
      },
      message: "INPUT.MOVE_TARGET",
      fallback: "INPUT.INVALID_DIRECTION",
    },
  ]
}
