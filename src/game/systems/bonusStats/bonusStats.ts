import { EntityRoleEnum, type Entity } from "../../../core/model/Entity"
import { getEntityByRole } from "../../../core/model/queries/entities/get"
import { getEqItems } from "../eq/eq"
import { getDmgMul } from "../attack/dmg"

export const getBonusStats = (entity: Entity): Entity | undefined => {
  return getEntityByRole(entity, EntityRoleEnum.BONUS_STATS)
}

const getAllBonusStats = (entity: Entity): Entity[] => {
  return getEqItems(entity)
    .flatMap(getBonusStats)
    .filter((bonusStats) => bonusStats !== undefined)
}

export const getBonusDmgMul = (entity: Entity): number => {
  const bonusStats = getAllBonusStats(entity)
  return bonusStats.reduce(
    (multiplier, stats) => multiplier * getDmgMul(stats),
    1,
  )
}
