import { hasComponentsByType } from "../../../core/model/queries/components/has"
import { BleedingEffectComponent } from "../../model/components/combat/BleedingEffectComponent"
import { canExplode } from "../explode/explode"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { assert } from "../../../utils/assert"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getDirection } from "../movement/position"
import { rollAttackDmg } from "./dmg"
import {
  WorldActionTypeEnum,
  WorldDealDamageActionReasonEnum,
  type WorldAttackAction,
} from "../world/types"
import { getAttackWeapon } from "./getAttackWeapon"

export const resolveWorldAttackAction = (
  gameAction: WorldAttackAction,
): ActionResolution => {
  const { sourceId, targetId } = gameAction
  const action = new Action(gameAction)

  ;(() => {
    const source = assert(getEntityById(sourceId), "No source")
    const target = assert(getEntityById(targetId), "No target")

    if (canExplode(source)) {
      action.addPendingImmediateAction({
        type: WorldActionTypeEnum.WORLD_INIT_EXPLODE,
        entityId: source.id,
      })
      return
    }
    if (hasComponentsByType(source, BleedingEffectComponent)) {
      action.addPendingImmediateAction({
        type: WorldActionTypeEnum.WORLD_INIT_BLEED,
        sourceId: source.id,
        targetId: target.id,
      })
    }

    const weapon = getAttackWeapon(source)
    if (!weapon) {
      return action.addPendingImmediateAction({
        type: WorldActionTypeEnum.WORLD_POKE,
        sourceId: source.id,
        direction: assert(getDirection(source, target), "No poke direction"),
      })
    }
    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_DEAL_DAMAGE,
      sourceId: source.id,
      targetId: target.id,
      dmg: rollAttackDmg(source),
      reason: WorldDealDamageActionReasonEnum.ATTACK,
    })
  })()

  return action.resolve()
}
