import { getVisibleTiles } from "../player/getVisibleTiles";
import { isHostile } from "../attack/hostililty";

export const isInCombat = (): boolean =>
  getVisibleTiles().some((tile) => tile.mobs.some(isHostile));
