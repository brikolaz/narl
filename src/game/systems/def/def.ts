import type { Entity } from "../../../core/model/Entity";
import {
  getComponentByType,
  getComponentsByType,
} from "../../../core/model/queries/components/get";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { getEntitiesByRole } from "../../../core/model/queries/entities/get";
import { EntityRole } from "../../../core/model/Entity";
import { DefComponent } from "../../model/components/combat/DefComponent";
import { DefModComponent } from "../../model/components/combat/DefModComponent";
import { isContainer } from "../containers/containers";
import { getEq } from "../eq/eq";

const getOwnDef = (entity?: Entity): number => {
  return getComponentsByType(entity, DefComponent).reduce(
    (total, component) => total + component.def,
    DefComponent.defaults.def,
  );
};

const getDefMod = (entity: Entity): number => {
  return (
    getComponentByType(entity, DefModComponent)?.defMod ??
    DefModComponent.defaults.defMod
  );
};

export const getDef = (entity?: Entity): number => {
  if (!entity) {
    return DefComponent.defaults.def;
  }
  const ownDef = getOwnDef(entity);
  if (!isContainer(entity)) {
    return ownDef;
  }
  const childrenDef = getEntitiesByRole(entity, EntityRole.ITEM).reduce(
    (def, child) => def + getDef(child),
    0,
  );
  return Math.ceil(ownDef + childrenDef * getDefMod(entity));
};

export const getTotalDef = (entity: Entity): number => {
  return getEq(entity).reduce((totalDef, slot) => {
    return totalDef + getDef(slot);
  }, getDef(entity));
};

export const getReducedDmg = (entity: Entity, dmg: number): number => {
  return Math.max(0, dmg - getTotalDef(entity));
};

export const isArmor = (entity: Entity) => {
  return hasComponentsByType(entity, DefComponent);
};

export const getEffectiveDef = (entity: Entity, eqSlot?: Entity) => {
  return Math.ceil(getDef(entity) * (eqSlot ? getDefMod(eqSlot) : 1));
};
