import type { GameAction } from "../../actions/types";
import { getVisibleTiles } from "../../player/getVisibleTiles";
import { pickMobWorldAction } from "./pickMobWorldAction";

// routing
export const scheduleMobActions = () => {
  const nextQueue: (GameAction | undefined)[] = [];
  const tiles = getVisibleTiles();

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const mobs = tile.mobs;

    for (const mob of mobs) {
      nextQueue.push(pickMobWorldAction(mob, tile));
    }
  }

  return nextQueue.filter(Boolean) as GameAction[];
};
