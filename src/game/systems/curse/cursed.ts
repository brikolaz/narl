import { Entity, hasComponentByType } from "../../../core/ecs";
import { CursedComponent } from "../../model/components/CursedComponent";

export const isCursed = (entity: Entity) => {
  return hasComponentByType(entity, CursedComponent);
};
