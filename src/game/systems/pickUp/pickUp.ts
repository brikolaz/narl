import type { ItemEntity } from "../../model";
import type { Tile } from "../../state";

export const pickUpItem = (tile: Tile): ItemEntity | undefined => {
  const item = tile.items.at(-1);
  if (!item) return;
  tile.items = tile.items.slice(0, -1);
  return item;
};
