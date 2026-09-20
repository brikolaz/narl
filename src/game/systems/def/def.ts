import { EntityRoleEnum, type Entity } from "../../../core/model/Entity"
import {
  getComponentByType,
  getComponentsByType,
} from "../../../core/model/queries/components/get"
import { hasComponentsByType } from "../../../core/model/queries/components/has"
import { getEntitiesByRole } from "../../../core/model/queries/entities/get"
import { DefComponent } from "../../model/components/combat/DefComponent"
import { DefMulComponent } from "../../model/components/combat/DefMulComponent"
import { isContainer } from "../containers/containers"
import { getEq } from "../eq/eq"

const getOwnDef = (entity?: Entity): number => {
  return getComponentsByType(entity, DefComponent).reduce(
    (total, component) => total + component.def,
    DefComponent.defaults.def,
  )
}

const getDefMul = (entity: Entity): number => {
  return (
    getComponentByType(entity, DefMulComponent)?.defMul ??
    DefMulComponent.defaults.defMul
  )
}

export const getDef = (entity?: Entity): number => {
  if (!entity) {
    return DefComponent.defaults.def
  }
  const ownDef = getOwnDef(entity)
  if (!isContainer(entity)) {
    return ownDef
  }
  const childrenDef = getEntitiesByRole(entity, EntityRoleEnum.ITEM).reduce(
    (def, child) => def + getDef(child),
    0,
  )
  return Math.ceil(ownDef + childrenDef * getDefMul(entity))
}

export const getTotalDef = (entity: Entity): number => {
  return getEq(entity).reduce((totalDef, slot) => {
    return totalDef + getDef(slot)
  }, getDef(entity))
}

export const getReducedDmg = (entity: Entity, dmg: number): number => {
  return Math.max(0, dmg - getTotalDef(entity))
}

export const isArmor = (entity: Entity) => {
  return hasComponentsByType(entity, DefComponent)
}

export const getEffectiveDef = (entity: Entity, eqSlot?: Entity) => {
  return Math.ceil(getDef(entity) * (eqSlot ? getDefMul(eqSlot) : 1))
}
