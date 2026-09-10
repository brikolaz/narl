import type { Id } from "../../../core/model/Id";
import { STATE, type Tile } from "../../state/state";

export const hasMobs = (tile: Tile) => tile.mobs.length > 0;

export const getMob = (tile: Tile) => tile.mobs[0];

export const getAllMobs = () => STATE.world.flatMap((tile) => tile.mobs);

export const getMobById = (tile: Tile, id: Id) => {
  return tile.mobs.find((mob) => mob.id === id);
};
