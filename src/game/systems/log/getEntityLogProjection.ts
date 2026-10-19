import { getEntityRegistryRecordById } from "../../../core/model/registry/entityRegistry"
import { getComponentByType } from "../../../core/model/queries/components/get"
import { hasComponentsByType } from "../../../core/model/queries/components/has"
import { OffensiveContainerCurseComponent } from "../../model/components/curse/OffensiveContainerCurseComponent"
import { DmgMulComponent } from "../../model/components/combat/DmgMulComponent"
import {
  getContainerSize,
  getMaxNestDepth,
  isContainer,
} from "../containers/containers"
import { isWeapon } from "../attack/getAttackWeapon"
import {
  getBaseChildrenDmgRange,
  getDmgMul,
  getDmgRange,
  getChildrenDmgRange,
} from "../attack/dmg"
import { getBonusStats } from "../bonusStats/bonusStats"
import { getChildrenDef, getEffectiveDef, isArmor } from "../def/def"
import { getInspectDesc } from "../inspect/inspect"

import { EntityRoleEnum, type Entity } from "../../../core/model/Entity"
import { getEntityName } from "../inspect/getEntityName"
import { isPlayer } from "../player/player"
import { STATE } from "../../state/state"
import type { EntityLogProjection } from "./types"

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
      depth: getMaxNestDepth(entity),
    }
    const baseDmg = getBaseChildrenDmgRange(entity)
    if (baseDmg) {
      projection.dmg = getDmgRange(entity)
      projection.container.contents = {
        baseDmg,
        dmg: getChildrenDmgRange(entity),
        dmgMul: getDmgMul(entity),
        def: getChildrenDef(entity),
        defToDmgMul: getComponentByType(
          entity,
          OffensiveContainerCurseComponent,
        )?.defToDmgMul,
      }
    }
  } else if (isWeapon(entity)) {
    const { min, max } = getDmgRange(entity)
    const multiplier = eqSlot ? getDmgMul(eqSlot) : 1
    projection.dmg = {
      min: Math.ceil(min * multiplier),
      max: Math.ceil(max * multiplier),
    }
  }
  if (isArmor(entity)) projection.def = getEffectiveDef(entity, eqSlot)
  const bonusStats = getBonusStats(entity)
  if (bonusStats && hasComponentsByType(bonusStats, DmgMulComponent)) {
    const multiplier = getDmgMul(bonusStats)
    if (multiplier !== DmgMulComponent.defaults.dmgMul)
      projection.bonusDmgMul = multiplier
  }
  return projection
}
