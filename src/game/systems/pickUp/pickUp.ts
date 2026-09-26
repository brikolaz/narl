import type { Entity } from "../../../core/model/Entity"
import type { Id } from "../../../core/model/Id"
import { hasComponentsByType } from "../../../core/model/queries/components/has"
import { removeById } from "../../../utils/removeById"
import { PickupableComponent } from "../../model/components/interaction/PickupableComponent"
import type { Tile } from "../../state/state"
import { setPosition } from "../position/position"

export const pickUpItem = (tile: Tile): Entity | undefined => {
  return tile.items.at(-1)
}

export const isPickupable = (item: Entity) => {
  return hasComponentsByType(item, PickupableComponent)
}

export const replaceFloorItem = (
  tile: Tile,
  itemId: Id,
  ...items: Entity[]
) => {
  removeById(tile.items, itemId)
  items.forEach((item) => setPosition(item, tile.position))
  tile.items.push(...items)
}
