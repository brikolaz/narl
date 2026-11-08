import { DefMulComponent } from "../../model/components/combat/DefMulComponent"
import { getDefMul } from "../def/def"
import { getContainerItems, isContainer } from "../containers/containers"
import { EntityRoleEnum, type Entity } from "../../../core/model/Entity"
import { getEntityByRole } from "../../../core/model/queries/entities/get"
import { getDmgMul } from "../attack/dmg"
import { getEqItems } from "../eq/eq"
import { DmgMulComponent } from "../../model/components/combat/DmgMulComponent"

export const getBonusStats = (entity: Entity): Entity | undefined => {
  return getEntityByRole(entity, EntityRoleEnum.BONUS_STATS)
}

const getRawItemBonusDmgMul = (entity: Entity): number => {
  const bonusStats = getBonusStats(entity)
  const multiplier = bonusStats
    ? getDmgMul(bonusStats)
    : DmgMulComponent.defaults.dmgMul
  if (!bonusStats || !isContainer(entity)) {
    return multiplier
  }
  return getContainerItems(entity).reduce(
    (total, item) => total * getRawItemBonusDmgMul(item),
    multiplier,
  )
}

const getRawItemBonusDefMul = (entity: Entity): number => {
  const bonusStats = getBonusStats(entity)
  const multiplier = bonusStats
    ? getDefMul(bonusStats)
    : DefMulComponent.defaults.defMul
  if (!bonusStats || !isContainer(entity)) {
    return multiplier
  }
  return getContainerItems(entity).reduce(
    (total, item) => total * getRawItemBonusDefMul(item),
    multiplier,
  )
}

const roundMultiplier = (multiplier: number): number =>
  Math.round(multiplier * 2) / 2

export const getItemBonusDmgMul = (entity: Entity): number =>
  roundMultiplier(getRawItemBonusDmgMul(entity))

export const getItemBonusDefMul = (entity: Entity): number =>
  roundMultiplier(getRawItemBonusDefMul(entity))

export const getBonusDmgMul = (entity: Entity): number => {
  return roundMultiplier(
    getEqItems(entity).reduce(
      (multiplier, item) => multiplier * getRawItemBonusDmgMul(item),
      DmgMulComponent.defaults.dmgMul,
    ),
  )
}

export const getBonusDefMul = (entity: Entity): number => {
  return roundMultiplier(
    getEqItems(entity).reduce(
      (multiplier, item) => multiplier * getRawItemBonusDefMul(item),
      DefMulComponent.defaults.defMul,
    ),
  )
}
