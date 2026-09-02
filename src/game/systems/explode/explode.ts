import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { ExplodeComponent } from "../../model/components/ExplodeComponent";
import { ExplodeRangeComponent } from "../../model/components/ExplodeRangeComponent";

export const canExplode = (entity: Entity) => {
  return (
    hasComponentsByType(entity, ExplodeComponent) &&
    hasComponentsByType(entity, ExplodeRangeComponent)
  );
};
