import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/components/get";
import { InspectedComponent } from "../components/inspect/InspectedComponent";

export const getInspectedTimes = (item: Entity) => {
  return (
    getComponentByType(item, InspectedComponent)?.times ??
    InspectedComponent.defaults.times
  );
};
