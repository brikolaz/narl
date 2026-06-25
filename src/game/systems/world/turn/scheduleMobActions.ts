import type { GameState } from "../../../state/state";
import type { GameAction } from "../../actions/types";
import { getVisibleTiles } from "../../render/getVisibleTiles";
import { pickMobWorldAction } from "./pickMobWorldAction";

// routing
export const scheduleMobActions = (gameState: GameState) => {
  const nextQueue: (GameAction | undefined)[] = [];
  const tiles = getVisibleTiles(gameState);

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const mobs = tile.mobs;

    for (const mob of mobs) {
      nextQueue.push(pickMobWorldAction(mob, tile, gameState));
    }
  }

  return nextQueue.filter(Boolean) as GameAction[];
};
