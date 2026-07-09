import type { Id } from "../../../core/ecs/Id";
import type { Tile } from "../../state/state";

export const hasMobs = (tile: Tile) => {
  return tile.mobs.length > 0;
};

export const getMob = (tile: Tile) => {
  return tile.mobs[0];
};

export const getMobById = (tile: Tile, id: Id) => {
  return tile.mobs.find((mob) => mob.id === id);
};

export const getMobPosition = (tile: Tile) => {
  return tile.mobs[0];
};
