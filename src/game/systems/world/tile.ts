import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { MAP_SIZE, MAX_WORLD_SIZE } from "../../../utils/constants";
import { ImpassableComponent } from "../../model/components/spatial/ImpassableComponent";
import { FloorEntityFactory } from "../../model/entities/FloorEntity";
import { STATE, type Tile } from "../../state/state";
import { getRandomMob } from "../rng/spawnTable";
import { hasMobs } from "../mobs/mobs";
import { getPlayer } from "../player/player";
import { getPosition } from "../position/position";

export const getTile = (position: number): Tile => {
  const tile = STATE.world[position];
  if (!tile) {
    throw new Error(`Tile ${position} does not exist`);
  }
  return tile;
};

export const isTileImpassable = (position: number) => {
  const tile = getTile(position);
  return (
    hasMobs(tile) ||
    getPosition(getPlayer()) === position ||
    tile.items.some((item) =>
      hasComponentsByType(item, ImpassableComponent),
    )
  );
};

export const getDefaultTile = (position: number): Tile => ({
  floor: FloorEntityFactory.getDefault(),
  items: [],
  mobs: [],
  position,
})

const generateTile = (position: number): Tile => {
  const tile = getDefaultTile(position)
  const mob = getRandomMob(position);
  if (mob) {
    tile.mobs.push(mob);
  }
  return tile;
};

export const discoverTiles = (centerPosition: number): void => {
  const half = Math.floor(MAP_SIZE / 2);

  const start = Math.max(0, centerPosition - half);
  const end = Math.min(MAX_WORLD_SIZE - 1, centerPosition + half);

  for (let position = start; position <= end; position++) {
    if (!STATE.world[position]) {
      STATE.world[position] = generateTile(position);
    }
  }
};
