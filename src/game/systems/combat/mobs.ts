import type { MobEntity } from "../../model/entities/mobs/MobEntity";
import type { Tile } from "../../state";

export const hasMobs = (tile: Tile) => {
  return tile.mobs.length > 0;
};

export const getMob = (tile: Tile) => {
  return tile.mobs[0];
};

export const getMobById = (tile: Tile, id: string) => {
  return tile.mobs.find((mob) => mob.id === id);
};

export const killMob = (mobs: MobEntity[]) => {
  mobs = mobs.splice(0, 1);
};

export const killMobById = (tile: Tile, id: string) => {
  tile.mobs = tile.mobs.filter((mob) => mob.id !== id);
};
