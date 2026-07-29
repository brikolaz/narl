import type { Entity } from "../../../core/model/Entity";
import type { Id } from "../../../core/model/Id";
import { removeById } from "../../../utils/removeById";
import type { Tile } from "../../state/state";

export const replaceFloorItem = (
  tile: Tile,
  itemId: Id,
  ...items: Entity[]
) => {
  removeById(tile.items, itemId);
  tile.items.push(...items);
};
