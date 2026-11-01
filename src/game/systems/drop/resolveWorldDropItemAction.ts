import { getEntityName } from "../inspect/getEntityName"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { assert } from "../../../core/utils/assert"
import { getContainerItems } from "../containers/containers"
import { getMobById } from "../mobs/mobs"
import { getTile } from "../world/tile"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { WorldDropItemAction } from "../world/types"
import { dropItem, isDroppable } from "./drop"

export const resolveWorldDropItemAction = (
  gameAction: WorldDropItemAction,
): ActionResolution => {
  const { entityId, targetPosition, itemId } = gameAction
  const action = new Action(gameAction)
  ;(() => {
    const tile = getTile(targetPosition)
    const source = assert(getMobById(tile, entityId), "No mob")

    const item = getEntityById(itemId)
    const itemsToDrop = []
    if (!item) {
      return action.fail("ITEM.NOTHING_TO_DROP")
    }
    if (isDroppable(item)) {
      itemsToDrop.push(item)
    } else {
      itemsToDrop.push(
        ...getContainerItems(item).filter((item) => isDroppable(item)),
      )
    }
    if (!itemsToDrop.length) {
      return
    }

    itemsToDrop.forEach((item) => dropItem(item, targetPosition))

    return action.success(
      "ITEM.DROPPED_BY",
      getEntityName(source),
      itemsToDrop.map(getEntityName),
    )
  })()

  return action.resolve()
}
