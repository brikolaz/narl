import {
  MAP_SIZE,
  MAX_WORLD_POSITION,
  MIN_WORLD_POSITION,
} from "../../../utils/constants";
import { getPlayerPosition } from "../../model/queries/player";
import type { GameState, Tile } from "../../state/state";

export const getVisibleTiles = (gameState: GameState): Tile[] => {
  const playerPosition = getPlayerPosition(gameState);
  const half = Math.floor(MAP_SIZE / 2); // 4

  let start = playerPosition - half;

  if (start < MIN_WORLD_POSITION) {
    start = MIN_WORLD_POSITION;
  }

  const maxStart = MAX_WORLD_POSITION - MAP_SIZE + 1;

  if (start > maxStart) {
    start = maxStart;
  }

  return gameState.world.slice(start, start + MAP_SIZE);
};
