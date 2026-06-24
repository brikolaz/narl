import type { Entity } from "../../../core/ecs/Entity";
import { hasComponentByType } from "../../../core/ecs/queries/component";
import { PickupableComponent } from "../../model/components/items/PickupableComponent";
import type { ItemEntity } from "../../model/entities/items/ItemEntity";
import type { Tile } from "../../state/state";

export const pickUpItem = (tile: Tile): ItemEntity | undefined => {
  return tile.items.at(-1);
};

export const isPickupable = (item: Entity) => {
  return hasComponentByType(item, PickupableComponent);
};
