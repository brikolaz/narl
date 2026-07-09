import type { Entity } from "../../../core/ecs/Entity";
import { hasComponentsByType } from "../../../core/ecs/queries/components/has";
import type { Tile } from "../../state/state";
import { PickupableComponent } from "../components/items/PickupableComponent";

export const pickUpItem = (tile: Tile): Entity | undefined => {
  return tile.items.at(-1);
};

export const isPickupable = (item: Entity) => {
  return hasComponentsByType(item, PickupableComponent);
};
