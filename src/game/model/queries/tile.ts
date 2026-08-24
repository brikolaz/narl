import { STATE, type Tile } from "../../state/state";
import { hasMobs } from "./mobs";
import { getPlayer } from "./player";
import { getPosition } from "./position";

export const getTile = (position: number): Tile => {
  const tile = STATE.world[position];

  if (!tile) {
    throw new Error(`Tile ${position} does not exist`);
  }

  return tile;
};

export const isTileOccupied = (position: number) => {
  const tile = getTile(position);
  return hasMobs(tile) || getPosition(getPlayer()) === position;
};
