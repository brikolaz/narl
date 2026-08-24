import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { removeComponentsByType } from "../../../core/model/queries/components/remove";
import { detachEntity } from "../../../core/model/queries/entities/remove";
import { DroppableComponent } from "../../model/components/items/DroppableComponent";
import { PositionComponent } from "../../model/components/PositionComponent";
import { getTile } from "../../model/queries/tile";
import { setPosition } from "../position/position";

export const dropItem = (item: Entity, targetPosition: number) => {
  const tile = getTile(targetPosition);
  detachEntity(item.id);
  removeComponentsByType(item, PositionComponent.type);
  tile.items.push(item);
  setPosition(item, targetPosition);
};

export const isDroppable = (item: Entity) => {
  return hasComponentsByType(item, DroppableComponent);
};
