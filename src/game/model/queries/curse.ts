import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { CursedComponent } from "../components/items/CursedComponent";

export const isCursed = (entity: Entity) => {
  return hasComponentsByType(entity, CursedComponent);
};
