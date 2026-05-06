import { hasComponentByType, type Entity } from "../../../core/ecs";
import type { ItemEntity } from "../../model";
import { PickupableComponent } from "../../model/components/PickupableComponent";
import type { Tile } from "../../state";

export const pickUpItem = (tile: Tile): ItemEntity | undefined => {
  return tile.items[0];
};

export const isPickupable = (item: Entity) => {
  return hasComponentByType(item, PickupableComponent);
};
