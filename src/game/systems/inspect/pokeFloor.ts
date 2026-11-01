import type { Tile } from "../../state"
import type { Action } from "../actions/action"
import { triggerOnInspectCurse } from "../curse/triggers/triggerOnInspectCurse"
import { getEntityLogProjection } from "../log/getEntityLogProjection"
import { increaseInspected } from "./inspect"

export const pokeFloor = (action: Action, tile: Tile): void => {
  const item = tile.items.at(-1)
  if (!item) {
    return action.info("POKE.NO_TARGET")
  }
  increaseInspected(item)
  action.info("INSPECT.ITEM", getEntityLogProjection(item))
  triggerOnInspectCurse(action, item)
}
