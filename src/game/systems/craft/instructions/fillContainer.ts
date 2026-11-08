import { getEqItems, isRemovable } from "../../eq/eq"
import { getPlayer } from "../../player/player"
import type { CraftInstruction } from "../types"
import {
  addItemsToContainer,
  getMaxNestDepth,
  getNestDepth,
  isContainer,
  isContainerFull,
} from "../../containers/containers"

export const fillContainer: CraftInstruction = (action, items) => {
  if (items.length !== 2) return undefined
  const [item, container] = items

  if (getEqItems(getPlayer()).includes(item) && !isRemovable(item)) {
    action.fail("ITEM.NOT_REMOVABLE")
    return undefined
  }

  if (isContainerFull(container)) {
    action.fail("CONTAINER.FULL")
    return undefined
  }
  const maxDepth = getMaxNestDepth(container)
  if (isContainer(item) && getNestDepth(item) + 1 > maxDepth) {
    action.fail("CONTAINER.MAX_DEPTH", maxDepth)
    return undefined
  }

  addItemsToContainer(container, item)
  return container
}
