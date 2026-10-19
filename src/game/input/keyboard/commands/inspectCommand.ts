import {
  EQ_SLOTS,
  INV_SLOTS,
  isEqLinkPoint,
  isInvLinkPoint,
  type EqSlot,
  type InvSlot,
} from "../../../render/state/slots"
import { UI_STATE } from "../../../render/state/state"
import { PlayerActionTypeEnum } from "../../../systems/player/types"
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain"
import { getAdjacentSlotActions } from "./slots"

const resetHighlights = () => {
  UI_STATE.highlights.invSlot.resetHighlightedSlot()
  UI_STATE.highlights.eqSlot.resetHighlightedSlot()
}

const getInvCommands = (): KeyboardToAction => ({
  ...getAdjacentSlotActions(
    (invSlot: InvSlot) => {
      UI_STATE.highlights.invSlot.resetHighlightedSlot()

      return {
        type: PlayerActionTypeEnum.PLAYER_INSPECT_INV,
        invSlot,
      }
    },
    UI_STATE.highlights.invSlot,
    INV_SLOTS,
    () => ({
      Tab: {
        action: () => {
          UI_STATE.highlights.invSlot.resetHighlightedSlot()
          return getEqCommands()
        },
        fallback: "INPUT.INVALID_DIRECTION",
      },
      ...(isInvLinkPoint() && {
        ArrowUp: {
          action: () => {
            UI_STATE.highlights.invSlot.resetHighlightedSlot()
            UI_STATE.highlights.eqSlot.highlightSlot(6)
            return getEqCommands()
          },
          fallback: "INPUT.INVALID_DIRECTION",
        },
      }),
    }),
  ),
})

const getEqCommands = (): KeyboardToAction => ({
  ...getAdjacentSlotActions(
    (eqSlot: EqSlot) => {
      UI_STATE.highlights.eqSlot.resetHighlightedSlot()

      return {
        type: PlayerActionTypeEnum.PLAYER_INSPECT_EQ,
        eqSlot,
      }
    },
    UI_STATE.highlights.eqSlot,
    EQ_SLOTS,
    () => ({
      Tab: {
        action: () => {
          UI_STATE.highlights.eqSlot.resetHighlightedSlot()
          return getInvCommands()
        },
        fallback: "INPUT.INVALID_DIRECTION",
      },
      ...(isEqLinkPoint() && {
        ArrowDown: {
          action: () => {
            UI_STATE.highlights.eqSlot.resetHighlightedSlot()
            UI_STATE.highlights.invSlot.highlightSlot(2)
            return getInvCommands()
          },
          fallback: "INPUT.INVALID_DIRECTION",
        },
      }),
    }),
  ),
})

export const getInspectCommand = (): KeyboardToActionCommand => ({
  action: () => getInvCommands(),
  message: "INPUT.INSPECT",
  fallback: "INPUT.INVALID_DIRECTION",
  cleanup: resetHighlights,
})
