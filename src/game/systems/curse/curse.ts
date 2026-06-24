import type { Entity } from "../../../core/ecs/Entity";
import { hasComponentByType } from "../../../core/ecs/queries/component";
import { CursedComponent } from "../../model/components/items/CursedComponent";

export const isCursed = (entity: Entity) => {
  return hasComponentByType(entity, CursedComponent);
};
