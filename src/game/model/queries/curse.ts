import type { Entity } from "../../../core/ecs/Entity";
import { hasComponentsByType } from "../../../core/ecs/queries/components/has";
import { CursedComponent } from "../components/items/CursedComponent";

export const isCursed = (entity: Entity) => {
  return hasComponentsByType(entity, CursedComponent);
};
