import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { DisabledComponent } from "../components/DisabledComponent";

export const isDisabled = (entity: Entity): boolean => {
  return hasComponentsByType(entity, DisabledComponent);
};
