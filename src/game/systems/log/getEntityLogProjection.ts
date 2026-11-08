import { getEntityRegistryRecordById } from "../../../core/model/registry/entityRegistry"
import { getComponentByType } from "../../../core/model/queries/components/get"
import { hasComponentsByType } from "../../../core/model/queries/components/has"
import { OffensiveContainerCurseComponent } from "../../model/components/curse/OffensiveContainerCurseComponent"
import { DmgMulComponent } from "../../model/components/combat/DmgMulComponent"
import { DefMulComponent } from "../../model/components/combat/DefMulComponent"
import {
  getContainerSize,
  getEmptySlots,
  getMaxNestDepth,
  isContainer,
} from "../containers/containers"
import { isWeapon } from "../attack/getAttackWeapon"
import {
  getBaseChildrenDmgRange,
  getDmgMul,
  getOwnDmgRange,
  getChildrenDmgRange,
} from "../attack/dmg"
import {
  getItemBonusDmgMul,
  getItemBonusDefMul,
} from "../bonusStats/bonusStats"
import {
  getChildrenDef,
  getEffectiveChildrenDef,
  getEffectiveDef,
  getOwnDef,
  getDefMul,
  isArmor,
} from "../def/def"
import { getInspectDesc } from "../inspect/inspect"

import { EntityRoleEnum, type Entity } from "../../../core/model/Entity"
import { getEntityName } from "../inspect/getEntityName"
import { isPlayer } from "../player/player"
import { STATE } from "../../state"
import type { BonusStatsLogProjection, EntityLogProjection } from "./types"

export const getEntityLogProjection = (entity: Entity): EntityLogProjection => {
  const parent = getEntityRegistryRecordById(entity.id)?.parent
  const eqSlot =
    parent && getEntityRegistryRecordById(parent.id)?.role === EntityRoleEnum.EQ
      ? parent
      : undefined
  const projection: EntityLogProjection = {
    name: getEntityName(entity),
    description: getInspectDesc(entity),
    isPlayer: STATE.player.player !== undefined && isPlayer(entity),
  }
  if (isContainer(entity)) {
    projection.container = {
      size: getContainerSize(entity),
      currentSize: getEmptySlots(entity).size,
      depth: getMaxNestDepth(entity),
    }
    projection.dmg = getOwnDmgRange(entity)
    projection.def = getOwnDef(entity)
    projection.container.contents = {
      baseDmg: getBaseChildrenDmgRange(entity),
      dmg: getChildrenDmgRange(entity),
      dmgMul: getDmgMul(entity),
      def: getChildrenDef(entity),
      defToDmgMul: getComponentByType(entity, OffensiveContainerCurseComponent)
        ?.defToDmgMul,
      defMul: getDefMul(entity),
      effectiveDef: getEffectiveChildrenDef(entity),
    }
  } else if (isWeapon(entity)) {
    const { min, max } = getOwnDmgRange(entity)
    const multiplier = eqSlot ? getDmgMul(eqSlot) : 1
    projection.dmg = {
      min: Math.ceil(min * multiplier),
      max: Math.ceil(max * multiplier),
    }
  }
  if (
    !isContainer(entity) &&
    (isArmor(entity) || hasComponentsByType(entity, DefMulComponent))
  ) {
    projection.def = getEffectiveDef(entity, eqSlot)
  }
  const bonusStats: BonusStatsLogProjection = {}
  const multiplier = getItemBonusDmgMul(entity)
  if (multiplier !== DmgMulComponent.defaults.dmgMul) {
    bonusStats.dmgMul = multiplier
  }
  const defMultiplier = getItemBonusDefMul(entity)
  if (defMultiplier !== DefMulComponent.defaults.defMul) {
    bonusStats.defMul = defMultiplier
  }
  if (bonusStats.dmgMul !== undefined || bonusStats.defMul !== undefined) {
    projection.bonusStats = bonusStats
  }
  return projection
}
