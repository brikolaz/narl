import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/components/get";
import { DefComponent } from "../components/items/DefComponent";

export const getDef = (entity: Entity): number => {
  const def =
    getComponentByType(entity, DefComponent)?.def ?? DefComponent.defaults.def;

  return def;
};
