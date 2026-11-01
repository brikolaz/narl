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
import { WorldActionTypeEnum } from "../../../systems/world/types"
import { MAX_WORLD_SIZE } from "../../../../core/utils/constants"
import { PlayerActionTypeEnum } from "../../../systems/player/types"
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain"
import { getAdjacentSlotActions } from "./slots"

const resetHighlights = () => {
  UI_STATE.highlights.invSlot.resetHighlightedSlot()
  UI_STATE.highlights.eqSlot.resetHighlightedSlot()
  UI_STATE.highlights.map.resetHighlightedSlot()
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
          return getMapCommands()
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

const getMapCommands = (): KeyboardToAction => {
  const highlight = UI_STATE.highlights.map
  if (highlight.getHighlightedSlot() === undefined) highlight.highlightSlot()

  const select = (offset: number): KeyboardToAction => {
    if (offset !== -1 && offset !== 0 && offset !== 1) return getMapCommands()
    const position = getPosition(getPlayer()) + offset
    if (position >= 0 && position < MAX_WORLD_SIZE)
      highlight.highlightSlot(offset)
    return getMapCommands()
  }
  const confirm = () => {
    const offset = highlight.getHighlightedSlot() ?? 0
    resetHighlights()
    return {
      type: WorldActionTypeEnum.WORLD_INSPECT,
      sourceId: getPlayer().id,
      targetPosition: getPosition(getPlayer()) + offset,
      floorOnly: offset === 0,
    }
  }
  return {
    ArrowLeft: {
      action: () => select((highlight.getHighlightedSlot() ?? 0) - 1),
    },
    ArrowRight: {
      action: () => select((highlight.getHighlightedSlot() ?? 0) + 1),
    },
    Space: { action: confirm },
    Tab: {
      action: () => {
        highlight.resetHighlightedSlot()
        return getEqCommands()
      },
    },
  }
}

export const getInspectCommand = (): KeyboardToActionCommand => ({
  action: () => getMapCommands(),
  message: "INPUT.INSPECT",
  fallback: "INPUT.INVALID_DIRECTION",
  cleanup: resetHighlights,
})
