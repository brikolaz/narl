import { MAP_SIZE, MAX_WORLD_SIZE } from "../../../utils";
import { FloorEntity } from "../../model/entities/FloorEntity";
import type { GameState, Tile } from "../../state/state";
import { getRandomMob } from "../rng/spawnTable";

const generateTile = (position: number): Tile => {
  const tile: Tile = {
    floor: new FloorEntity(),
    items: [],
    mobs: [],
    position,
  };
  const mob = getRandomMob(position);
  if (mob) {
    tile.mobs.push(mob);
  }
  return tile;
};

export const getTile = (gameState: GameState, position: number): Tile => {
  const tile = gameState.world[position];

  if (!tile) {
    throw new Error(`Tile ${position} does not exist`);
  }

  return tile;
};

export const discoverTiles = (
  gameState: GameState,
  centerPosition: number,
): void => {
  const half = Math.floor(MAP_SIZE / 2);

  const start = Math.max(0, centerPosition - half);
  const end = Math.min(MAX_WORLD_SIZE - 1, centerPosition + half);

  for (let position = start; position <= end; position++) {
    if (!gameState.world[position]) {
      gameState.world[position] = generateTile(position);
    }
  }
};
