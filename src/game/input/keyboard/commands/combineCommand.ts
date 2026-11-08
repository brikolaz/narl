import type { Id } from "../../../../core/model/Id"
import {
  getBackpack,
  getContainerItemAt,
} from "../../../systems/containers/containers"
import { getEqSlotByPosition } from "../../../systems/eq/eq"
import { getPlayer } from "../../../systems/player/player"
import { UI_STATE } from "../../../render/state/state"
import {
  EQ_SLOTS,
  INV_SLOTS,
  isEqLinkPoint,
  isInvLinkPoint,
  type EqSlot,
  type InvSlot,
} from "../../../render/state/slots"
import { PlayerActionTypeEnum } from "../../../systems/player/types"
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain"
import { getAdjacentSlotActions } from "./slots"

const resetHighlights = () => {
  UI_STATE.highlights.invSlot.resetHighlightedSlot()
  UI_STATE.highlights.eqSlot.resetHighlightedSlot()
}

export const getCombineCommand = (): KeyboardToActionCommand[] => {
  let firstItemId: Id | undefined

  const getSelectionCommands = (stage: number): KeyboardToAction => {
    const select = (itemId: Id | undefined) => {
      if (stage === 1) {
        firstItemId = itemId
        return
      }
      resetHighlights()
      return {
        type: PlayerActionTypeEnum.PLAYER_CRAFT,
        items: [firstItemId, itemId],
      }
    }

    const getInvCommands = (): KeyboardToAction => {
      UI_STATE.highlights.invSlot.setCommandStage(stage)
      return getAdjacentSlotActions(
        (slot: InvSlot) => {
          const backpack = getBackpack(getPlayer())
          return select(backpack && getContainerItemAt(backpack, slot)?.id)
        },
        UI_STATE.highlights.invSlot,
        INV_SLOTS,
        () => ({
          Tab: {
            action: () => {
              resetHighlights()
              return getEqCommands()
            },
          },
          ...(isInvLinkPoint() && {
            ArrowUp: {
              action: () => {
                resetHighlights()
                UI_STATE.highlights.eqSlot.highlightSlot(6)
                return getEqCommands()
              },
            },
          }),
        }),
      )
    }

    const getEqCommands = (): KeyboardToAction => {
      UI_STATE.highlights.eqSlot.setCommandStage(stage)
      return getAdjacentSlotActions(
        (slot: EqSlot) => {
          const eqSlot = getEqSlotByPosition(getPlayer(), slot)
          return select(eqSlot && getContainerItemAt(eqSlot, 1)?.id)
        },
        UI_STATE.highlights.eqSlot,
        EQ_SLOTS,
        () => ({
          Tab: {
            action: () => {
              resetHighlights()
              return getInvCommands()
            },
          },
          ...(isEqLinkPoint() && {
            ArrowDown: {
              action: () => {
                resetHighlights()
                UI_STATE.highlights.invSlot.highlightSlot(2)
                return getInvCommands()
              },
            },
          }),
        }),
      )
    }

    return stage === 2 &&
      UI_STATE.highlights.eqSlot.getHighlightedSlot() !== undefined
      ? getEqCommands()
      : getInvCommands()
  }

  return [
    {
      action: () => getSelectionCommands(1),
      message: "INPUT.COMBINE_FIRST",
      fallback: "INPUT.INVALID_DIRECTION",
      cleanup: resetHighlights,
    },
    {
      action: () => getSelectionCommands(2),
      message: "INPUT.COMBINE_SECOND",
      fallback: "INPUT.INVALID_DIRECTION",
      cleanup: resetHighlights,
    },
  ]
}
