import { getEntityName } from "../inspect/getEntityName"
import { removeById } from "../../../utils/removeById"
import { getPlayer } from "../player/player"
import { getPosition } from "../position/position"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import {
  addItemToEntityBackpack,
  getBackpack,
  isContainerFull,
} from "../containers/containers"
import type { PlayerPickUpAction } from "../player/types"
import { isPickupable, pickUpItem } from "./pickUp"
import { getVisibleTiles } from "../player/getVisibleTiles"
import { triggerOnPickupCurse } from "../curse/triggers/triggerOnPickupCurse"
import { getEntityLogProjection } from "../log/getEntityLogProjection"

export const resolvePlayerPickUpAction = (
  gameAction: PlayerPickUpAction,
): ActionResolution => {
  const action = new Action(gameAction)
  ;(() => {
    const player = getPlayer()
    const playerPosition = getPosition(player)
    getVisibleTiles().forEach((tile) => {
      if (playerPosition !== tile.position) {
        return
      }

      const backpack = getBackpack(player)
      if (!backpack) {
        return
      }
      const itemToPickUp = pickUpItem(tile)
      if (!itemToPickUp) {
        return action.fail("ITEM.NOTHING_TO_PICK_UP")
      }

      if (isContainerFull(backpack)) {
        return action.fail(
          "ITEM.CANNOT_PICK_UP_FULL",
          getEntityName(itemToPickUp),
        )
      }

      if (!isPickupable(itemToPickUp)) {
        return action.fail("ITEM.NOT_PICKUPABLE", getEntityName(itemToPickUp))
      }
      addItemToEntityBackpack(player, itemToPickUp)
      removeById(tile.items, itemToPickUp.id)
      action.success("ITEM.PICKED_UP", getEntityLogProjection(itemToPickUp))
      triggerOnPickupCurse(action, itemToPickUp)
    })
  })()

  return action.resolve()
}
