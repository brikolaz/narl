import { EntityRoleEnum, type Entity } from "../../../core/model/Entity"
import { getComponentByType } from "../../../core/model/queries/components/get"
import { getEntitiesByRole } from "../../../core/model/queries/entities/get"
import { DmgComponent } from "../../model/components/combat/DmgComponent"
import { DmgMulComponent } from "../../model/components/combat/DmgMulComponent"
import { isContainer } from "../containers/containers"
import { getBonusDmgMul } from "../bonusStats/bonusStats"
import { getRng } from "../rng/rng"
import { getAttackWeapon } from "./getAttackWeapon"

export type DmgRange = { min: number; max: number }

const addDmgRanges = (left: DmgRange, right: DmgRange): DmgRange => ({
  min: left.min + right.min,
  max: left.max + right.max,
})

const getOwnDmgRange = (entity: Entity): DmgRange => {
  const dmg = getComponentByType(entity, DmgComponent)
  return {
    min: dmg?.min ?? DmgComponent.defaults.min,
    max: dmg?.max ?? DmgComponent.defaults.max,
  }
}

export const getDmgMul = (entity: Entity): number => {
  return (
    getComponentByType(entity, DmgMulComponent)?.dmgMul ??
    DmgMulComponent.defaults.dmgMul
  )
}

export const getBaseChildrenDmgRange = (entity: Entity): DmgRange => {
  return getEntitiesByRole(entity, EntityRoleEnum.ITEM).reduce(
    (range, child) => addDmgRanges(range, getDmgRange(child)),
    { min: DmgComponent.defaults.min, max: DmgComponent.defaults.max },
  )
}

export const getChildrenDmgRange = (entity: Entity): DmgRange => {
  const childrenDmg = getBaseChildrenDmgRange(entity)
  const dmgMul = getDmgMul(entity)

  return {
    min: Math.ceil(childrenDmg.min * dmgMul),
    max: Math.ceil(childrenDmg.max * dmgMul),
  }
}

export const getDmgRange = (entity: Entity): DmgRange => {
  const ownDmg = getOwnDmgRange(entity)

  if (!isContainer(entity)) {
    return ownDmg
  }

  const childrenDmg = getBaseChildrenDmgRange(entity)
  const dmgMul = getDmgMul(entity)
  return {
    min: Math.ceil(ownDmg.min + childrenDmg.min * dmgMul),
    max: Math.ceil(ownDmg.max + childrenDmg.max * dmgMul),
  }
}

export const getAttackDmgRange = (source: Entity): DmgRange => {
  const weapon = getAttackWeapon(source)
  if (!weapon) {
    return DmgComponent.defaults
  }

  const bonusDmgMul = getBonusDmgMul(source)

  const weaponDmg = getDmgRange(weapon)

  return {
    min: Math.ceil(weaponDmg.min * bonusDmgMul),
    max: Math.ceil(weaponDmg.max * bonusDmgMul),
  }
}

export const rollAttackDmg = (source: Entity): number => {
  const { min, max } = getAttackDmgRange(source)
  return getRng(source).range(min, max)
}
