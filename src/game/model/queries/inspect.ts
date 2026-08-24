import type { Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { InspectedComponent } from "../components/inspect/InspectedComponent";

export const getInspectedTimes = (item: Entity) => {
  return (
    getComponentByType(item, InspectedComponent)?.times ??
    InspectedComponent.defaults.times
  );
};
