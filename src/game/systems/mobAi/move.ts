import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { MovableComponent } from "../../model/components/MovableComponent";

export const isMovable = (entity: Entity) => {
  return hasComponentsByType(entity, MovableComponent);
};
