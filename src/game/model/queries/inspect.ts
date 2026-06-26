import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { InspectedComponent } from "../components/inspect/InspectedComponent";

export const getInspectedTimes = (item: Entity) => {
  return (
    getComponentByType(item, InspectedComponent)?.times ??
    InspectedComponent.DEFAULT_TIMES
  );
};
