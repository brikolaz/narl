import { STATE, type Tile } from "../../state/state";

export const getTile = (position: number): Tile => {
  const tile = STATE.world[position];

  if (!tile) {
    throw new Error(`Tile ${position} does not exist`);
  }

  return tile;
};
