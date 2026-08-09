import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { UnawareComponent } from "../../model/components/UnawareComponent";

export const isAware = (entity: Entity) => {
  return !hasComponentsByType(entity, UnawareComponent);
};
