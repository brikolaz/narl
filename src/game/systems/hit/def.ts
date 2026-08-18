import type { Entity } from "../../../core/model/Entity";
import { getContainerItemAt } from "../../model/queries/containers";
import { getDef } from "../../model/queries/def";
import { getEq } from "../../model/queries/eq";

export const getTotalDef = (entity: Entity): number => {
  return getEq(entity).reduce((totalDef, slot) => {
    const item = getContainerItemAt(slot, 1);
    return totalDef + getDef(item);
  }, getDef(entity));
};

export const getReducedDmg = (entity: Entity, dmg: number) => {
  return Math.max(0, dmg - getTotalDef(entity));
};
