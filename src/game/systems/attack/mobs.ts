import type { Tile } from "../../state/state";

export const removeMobById = (tile: Tile, id: string) => {
  tile.mobs = tile.mobs.filter((mob) => mob.id !== id);
};
