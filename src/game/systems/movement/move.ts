import type { Entity } from "../../../core/model/Entity"
import { patchComponentByType } from "../../../core/model/queries/components/patch"
import { removeById } from "../../../core/utils/removeById"
import { PositionComponent } from "../../model/components/spatial/PositionComponent"
import { getPosition } from "../position/position"
import { getTile } from "../world/tile"

export const moveMob = (entity: Entity, nextPosition: number) => {
  const tile = getTile(getPosition(entity))
  removeById(tile.mobs, entity.id)
  const nextTile = getTile(nextPosition)
  nextTile.mobs.push(entity)
  patchComponentByType(entity, PositionComponent, (component) => {
    component.position = nextPosition
  })
}
