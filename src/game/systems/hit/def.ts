import type { Entity } from "../../../core/model/Entity";
import { getDef } from "../../model/queries/def";
import { getEq } from "../../model/queries/eq";

export const getTotalDef = (entity: Entity): number => {
  return getEq(entity).reduce((totalDef, slot) => {
    return totalDef + getDef(slot);
  }, getDef(entity));
};

export const getReducedDmg = (entity: Entity, dmg: number) => {
  return Math.max(0, dmg - getTotalDef(entity));
};
