import { getEntityName } from "../inspect/getEntityName"
import type { Entity } from "../../../core/model/Entity"
import { assert } from "../../../core/utils/assert"
import { getBackpack, getContainerItemAt } from "../containers/containers"
import { getEqSlotByPosition, isRemovable } from "../eq/eq"
import { getPlayer } from "../player/player"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import {
  PlayerDropItemActionReasonEnum,
  type PlayerDropItemAction,
} from "../player/types"
import { dropItem } from "./drop"

export const resolvePlayerDropItemAction = (
  gameAction: PlayerDropItemAction,
): ActionResolution => {
  const { eqSlot, invSlot, targetPosition, reason } = gameAction
  const action: Action = new Action(gameAction)
  ;(() => {
    const player = getPlayer()
    const backpack = assert(getBackpack(player), "Player has no backpack")
    const source = assert(
      eqSlot
        ? getEqSlotByPosition(player, eqSlot)
        : invSlot
          ? backpack
          : undefined,
      "No source to drop item",
    )
    let itemToDrop: Entity | undefined = undefined

    if (eqSlot !== undefined) {
      itemToDrop = getContainerItemAt(source, 1)
      if (!itemToDrop) {
        return action.fail("ITEM.EMPTY_SLOT", getEntityName(source))
      }
      if (!isRemovable(itemToDrop)) {
        return action.fail("ITEM.NOT_REMOVABLE")
      }
    } else if (invSlot !== undefined) {
      itemToDrop = getContainerItemAt(source, invSlot)
      if (!itemToDrop) {
        return action.fail("ITEM.NO_DROP_AT_SLOT", invSlot)
      }
    }
    itemToDrop = assert(itemToDrop, "No item to drop")
    dropItem(itemToDrop, targetPosition)

    if (reason === PlayerDropItemActionReasonEnum.MANUAL) {
      return action.success("ITEM.DROPPED", getEntityName(itemToDrop))
    }

    return action.success(
      "ITEM.DROPPED_BACKPACK_FULL",
      getEntityName(itemToDrop),
    )
  })()

  return action.resolve()
}
