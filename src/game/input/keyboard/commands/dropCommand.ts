import {
  EQ_SLOTS,
  INV_SLOTS,
  isEqLinkPoint,
  isInvLinkPoint,
  type EqSlot,
  type InvSlot,
} from "../../../render/state/slots"
import { UI_STATE } from "../../../render/state/state"
import { getPlayer } from "../../../systems/player/player"
import { getPosition } from "../../../systems/position/position"
import {
  PlayerActionTypeEnum,
  PlayerDropItemActionReasonEnum,
} from "../../../systems/player/types"
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
        type: PlayerActionTypeEnum.PLAYER_DROP_ITEM,
        invSlot,
        eqSlot: undefined,
        targetPosition: getPosition(getPlayer()),
        reason: PlayerDropItemActionReasonEnum.MANUAL,
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
        fallback: "Invalid direction",
      },
      ...(isInvLinkPoint() && {
        ArrowUp: {
          action: () => {
            UI_STATE.highlights.invSlot.resetHighlightedSlot()
            UI_STATE.highlights.eqSlot.highlightSlot(6)
            return getEqCommands()
          },
          fallback: "Invalid direction",
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
        type: PlayerActionTypeEnum.PLAYER_DROP_ITEM,
        eqSlot,
        invSlot: undefined,
        targetPosition: getPosition(getPlayer()),
        reason: PlayerDropItemActionReasonEnum.MANUAL,
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
        fallback: "Invalid direction",
      },
      ...(isEqLinkPoint() && {
        ArrowDown: {
          action: () => {
            UI_STATE.highlights.eqSlot.resetHighlightedSlot()
            UI_STATE.highlights.invSlot.highlightSlot(2)
            return getInvCommands()
          },
          fallback: "Invalid direction",
        },
      }),
    }),
  ),
})

export const getDropCommand = (): KeyboardToActionCommand => ({
  action: () => getInvCommands(),
  message: "Drop INV item (arrow keys, Tab for EQ, space to confirm)",
  fallback: "Invalid direction",
  cleanup: resetHighlights,
})
