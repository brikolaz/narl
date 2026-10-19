import { getEntityName } from "../inspect/getEntityName"
import {
  addItemsToContainer,
  getBackpack,
  getContainerItemAt,
  getMaxNestDepth,
  getNestDepth,
  isContainer,
  isContainerFull,
} from "../containers/containers"
import { assert } from "../../../utils/assert"
import { getPlayer } from "../player/player"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { PlayerMoveItemAction } from "../player/types"

export const resolvePlayerMoveItemAction = (
  gameAction: PlayerMoveItemAction,
): ActionResolution => {
  const { fromSlot, toSlot } = gameAction
  const action: Action = new Action(gameAction)
  ;(() => {
    const player = getPlayer()
    const backpack = assert(getBackpack(player), "No backpack")
    const fromItem = getContainerItemAt(backpack, fromSlot)
    const toItem = getContainerItemAt(backpack, toSlot)

    if (!fromItem || !toItem) {
      return action.fail("ITEM.INVALID_SELECTION")
    }

    if (fromItem.id === toItem.id) {
      return action.fail("ITEM.SAME_SELECTION")
    }

    if (!isContainer(toItem)) {
      return action.fail("CONTAINER.INVALID_TARGET")
    }

    if (isContainerFull(toItem)) {
      return action.fail("CONTAINER.FULL")
    }

    if (isContainer(fromItem)) {
      const fromItemNestDepth = getNestDepth(fromItem)
      const toItemMaxNextDepth = getMaxNestDepth(toItem)
      if (fromItemNestDepth + 1 > toItemMaxNextDepth) {
        return action.fail("CONTAINER.MAX_DEPTH", toItemMaxNextDepth)
      }
    }

    addItemsToContainer(toItem, fromItem)

    action.success("ITEM.MOVED", getEntityName(fromItem), getEntityName(toItem))
  })()

  return action.resolve()
}
