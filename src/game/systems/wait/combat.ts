import { getVisibleTiles } from "../player/getVisibleTiles"
import { isHostile } from "../attack/hostility"

export const isSafe = (): boolean =>
  !getVisibleTiles().some((tile) => tile.mobs.some(isHostile))
