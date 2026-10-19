import { getEntityName } from "../inspect/getEntityName"
import {
  getBackpack,
  isContainer,
  isContainerFull,
  unpackContainer,
} from "../containers/containers"
import { assert } from "../../../utils/assert"
import { isCursed } from "../curse/curse"
import { pickUpItem, replaceFloorItem } from "./pickUp"
import { getPlayer } from "../player/player"
import { getPosition } from "../position/position"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getVisibleTiles } from "../player/getVisibleTiles"
import {
  PlayerActionTypeEnum,
  type PlayerPickUpUnpackAction,
} from "../player/types"

export const resolvePlayerPickUpUnpackAction = (
  gameAction: PlayerPickUpUnpackAction,
): ActionResolution => {
  const action: Action = new Action(gameAction)
  ;(() => {
    const player = getPlayer()
    const playerPosition = getPosition(player)
    getVisibleTiles().forEach((tile) => {
      if (playerPosition !== tile.position) {
        return
      }

      const backpack = assert(getBackpack(player), "Player has no backpack.")

      const itemToPickUp = pickUpItem(tile)
      if (!itemToPickUp) {
        return action.fail("ITEM.NOTHING_TO_PICK_UP")
      }
      if (isContainerFull(backpack)) {
        return action.fail("ITEM.BACKPACK_FULL")
      }

      if (!isContainer(itemToPickUp) || isCursed(itemToPickUp)) {
        return action.addPendingImmediateAction({
          type: PlayerActionTypeEnum.PLAYER_PICK_UP,
        })
      }
      const unpackedContainer = unpackContainer(itemToPickUp)
      replaceFloorItem(tile, itemToPickUp.id, ...unpackedContainer)
      action.addPendingImmediateAction({
        type: PlayerActionTypeEnum.PLAYER_PICK_UP,
      })
      if (unpackedContainer.length > 1) {
        return action.info("CONTAINER.UNPACKED", getEntityName(itemToPickUp))
      }
    })
  })()

  return action.resolve()
}
