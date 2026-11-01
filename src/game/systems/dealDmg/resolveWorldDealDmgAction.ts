import { getEntityLogProjection } from "../log/getEntityLogProjection"
import { getEntityName } from "../inspect/getEntityName"
import { getComponentByType } from "../../../core/model/queries/components/get"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { ProvokableComponent } from "../../model/components/ai/ProvokableComponent"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { resolveMobDeath } from "../attack/resolveMobDeath"
import { hit } from "../hit/hit"
import { isHostile } from "../attack/hostility"
import { isPlayer } from "../player/player"
import { getRng } from "../rng/rng"
import {
  WorldActionTypeEnum,
  WorldDealDmgActionReasonEnum,
  WorldKillActionReasonEnum,
  type WorldDealDmgAction,
} from "../world/types"

export const resolveWorldDealDmgAction = (
  gameAction: WorldDealDmgAction,
): ActionResolution => {
  const action = new Action(gameAction)

  ;(() => {
    const source = getEntityById(gameAction.sourceId)
    const target = getEntityById(gameAction.targetId)
    if (
      !target ||
      (gameAction.reason === WorldDealDmgActionReasonEnum.ATTACK && !source)
    ) {
      return
    }
    const hitResult = hit(target, gameAction.dmg)

    if (gameAction.reason === WorldDealDmgActionReasonEnum.ATTACK) {
      if (!source) return
      if (hitResult.dmg === 0) {
        action.success(
          "ATTACK.TINGLE",
          getEntityName(source),
          getEntityName(target),
        )
      } else {
        action.success(
          "ATTACK.HIT",
          getEntityLogProjection(source),
          getEntityName(target),
          hitResult.dmg,
        )
      }
    } else if (hitResult.dmg === 0) {
      action.success("EXPLOSION.TINGLE", getEntityName(target))
    } else {
      action.info(
        "EXPLOSION.DAMAGE",
        getEntityLogProjection(target),
        hitResult.dmg,
      )
    }

    if (hitResult.nextHp <= 0 && !isPlayer(target)) {
      return resolveMobDeath(
        action,
        target,
        gameAction.reason === WorldDealDmgActionReasonEnum.EXPLODE
          ? WorldKillActionReasonEnum.EXPLODE
          : WorldKillActionReasonEnum.ATTACK,
      )
    }

    const provokable = getComponentByType(target, ProvokableComponent)
    if (
      provokable &&
      !isHostile(target) &&
      getRng(target).chance(provokable.dmgChance)
    ) {
      action.addPendingImmediateAction({
        type: WorldActionTypeEnum.WORLD_ENRAGE,
        entityId: target.id,
      })
    }
  })()

  return action.resolve()
}
