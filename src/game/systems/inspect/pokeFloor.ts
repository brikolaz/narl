import { inspectItem } from "./inspectItem"
import type { Tile } from "../../state"
import type { Action } from "../actions/action"

export const pokeFloor = (action: Action, tile: Tile): void => {
  const item = tile.items.at(-1)
  if (!item) {
    return action.info("POKE.NO_TARGET")
  }
  inspectItem(action, item)
}
