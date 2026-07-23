import type { Entity } from "../../../../core/ecs/Entity";
import { hasComponentsByType } from "../../../../core/ecs/queries/components/has";
import { DisabledComponent } from "../../../model/components/DisabledComponent";

export const isDisabled = (entity: Entity): boolean => {
  return hasComponentsByType(entity, DisabledComponent);
};
