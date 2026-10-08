import { getComponentByType } from "../../../core/model/queries/components/get"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { ProvokableComponent } from "../../model/components/ai/ProvokableComponent"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { resolveMobDeath } from "../attack/resolveMobDeath"
import { hit } from "../hit/hit"
import { getEntityName } from "../inspect/getEntityName"
import { isPlayer } from "../player/player"
import { getRng } from "../rng/rng"
import {
  WorldActionTypeEnum,
  WorldDealDamageActionReasonEnum,
  WorldKillActionReasonEnum,
  type WorldDealDamageAction,
} from "../world/types"

export const resolveWorldDealDamageAction = (
  gameAction: WorldDealDamageAction,
): ActionResolution => {
  const action = new Action(gameAction)

  ;(() => {
    const source = getEntityById(gameAction.sourceId)
    const target = getEntityById(gameAction.targetId)
    if (
      !target ||
      (gameAction.reason === WorldDealDamageActionReasonEnum.ATTACK && !source)
    ) {
      return
    }
    const hitResult = hit(target, gameAction.dmg)

    if (gameAction.reason === WorldDealDamageActionReasonEnum.ATTACK) {
      if (hitResult.dmg === 0) {
        action.success(
          `${getEntityName(source)} tingled ${getEntityName(target)}`,
        )
      } else {
        action.success(
          `${getEntityName(source)} hits ${getEntityName(target)} for ${hitResult.dmg} HP`,
        )
      }
    } else if (hitResult.dmg === 0) {
      action.success(`Explosion tingled ${getEntityName(target)}`)
    } else {
      action.info(
        `${getEntityName(target)} takes ${hitResult.dmg} explosion DMG`,
      )
    }

    if (hitResult.nextHp <= 0 && !isPlayer(target)) {
      return resolveMobDeath(
        action,
        target,
        gameAction.reason === WorldDealDamageActionReasonEnum.EXPLODE
          ? WorldKillActionReasonEnum.EXPLODE
          : WorldKillActionReasonEnum.ATTACK,
      )
    }

    const chanceToProvoke =
      getComponentByType(target, ProvokableComponent)?.damageChance ??
      ProvokableComponent.defaults.damageChance
    if (getRng(target).chance(chanceToProvoke)) {
      action.addPendingImmediateAction({
        type: WorldActionTypeEnum.WORLD_ENRAGE,
        entityId: target.id,
      })
    }
  })()

  return action.resolve()
}
