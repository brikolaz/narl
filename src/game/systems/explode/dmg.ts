import type { Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { ExplodeComponent } from "../../model/components/ExplodeComponent";
import { getRng } from "../rng/rng";

// TODO: somehow combine with ATTACT dmg utils
export const getExplodeDmgRange = (entity: Entity) => {
  const explode = getComponentByType(entity, ExplodeComponent);
  return {
    min: explode?.min ?? ExplodeComponent.defaults.min,
    max: explode?.max ?? ExplodeComponent.defaults.max,
  };
};

export const rollExplodeDmg = (entity: Entity): number => {
  const { min, max } = getExplodeDmgRange(entity);
  return getRng(entity).range(min, max);
};
