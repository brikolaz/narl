import type { Entity } from "../../../core/model/Entity"
import type { Tile } from "../../state"
import type { Action } from "../actions/action"
import { getMob } from "../mobs/mobs"
import { getPlayer } from "../player/player"
import { getPosition } from "../position/position"
import { pokeFloor } from "./pokeFloor"
import { pokeMob } from "./pokeMob"

export const poke = (
  action: Action,
  source: Entity,
  tile: Tile,
  floorOnly = false,
): void => {
  const player = getPlayer()
  const target =
    source.id !== player.id && getPosition(player) === tile.position
      ? player
      : getMob(tile)

  if (target && !floorOnly) {
    return pokeMob(action, source, target)
  }
  pokeFloor(action, tile)
}
