import { MAP_SIZE, MAX_WORLD_SIZE } from "../../../utils/constants";
import {
  FloorEntityFactory
} from "../../model/entities/FloorEntity";
import { STATE, type Tile } from "../../state/state";
import { getRandomMob } from "../rng/spawnTable";

const generateTile = (position: number): Tile => {
  const tile: Tile = {
    floor: FloorEntityFactory.getDefault(),
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

export const discoverTiles = (
  centerPosition: number,
): void => {
  const half = Math.floor(MAP_SIZE / 2);

  const start = Math.max(0, centerPosition - half);
  const end = Math.min(MAX_WORLD_SIZE - 1, centerPosition + half);

  for (let position = start; position <= end; position++) {
    if (!STATE.world[position]) {
      STATE.world[position] = generateTile(position);
    }
  }
};
