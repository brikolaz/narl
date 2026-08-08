import { hasComponentsByType } from "../../../core/model/queries/components/has";
import type { EntityArgument } from "../../../core/model/queries/entities/normalize";
import { CursedComponent } from "../components/items/CursedComponent";

export const isCursed = (entity: EntityArgument) => {
  return hasComponentsByType(entity, CursedComponent);
};
