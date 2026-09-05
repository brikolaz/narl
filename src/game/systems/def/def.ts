import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { DefComponent } from "../../model/components/items/DefComponent";
import { getDef, getDefMod } from "../../model/queries/def";
import { getEq } from "../../model/queries/eq";

export const getTotalDef = (entity: Entity): number => {
  return getEq(entity).reduce((totalDef, slot) => {
    return totalDef + getDef(slot);
  }, getDef(entity));
};

export const getReducedDmg = (entity: Entity, dmg: number): number => {
  return Math.max(0, dmg - getTotalDef(entity));
};

export const isArmor = (entity: Entity) => {
  return hasComponentsByType(entity, DefComponent)
}

export const getEffectiveDef = (entity: Entity, eqSlot?: Entity) => {
  return Math.ceil(getDef(entity) * (eqSlot ? getDefMod(eqSlot) : 1));
};