import { hasComponentsByType } from "../../../core/model/queries/components/has"
import { BleedingEffectComponent } from "../../model/components/combat/BleedingEffectComponent"
import { getAttackWeapon } from "../attack/getAttackWeapon"
import { assert } from "../../../core/utils/assert"
import { getMob, hasMobs } from "../mobs/mobs"
import { getPlayer } from "../player/player"
import { getTile } from "../world/tile"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { rollAttackDmg } from "../attack/dmg"
import type { PlayerMeleeAttackAction } from "../player/types"
import {
  WorldActionTypeEnum,
  WorldDealDmgActionReasonEnum,
} from "../world/types"

export const resolvePlayerMeleeAttackAction = (
  gameAction: PlayerMeleeAttackAction,
): ActionResolution => {
  const action = new Action(gameAction)
  const { targetPosition } = gameAction

  ;(() => {
    const source = getPlayer()
    const target = getTile(targetPosition)

    if (!target || !hasMobs(target)) {
      return action.fail("ATTACK.NO_TARGET")
    }
    const mob = assert(getMob(target), "No mob to attack")
    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_DEAL_DMG,
      sourceId: source.id,
      targetId: mob.id,
      dmg: rollAttackDmg(source),
      reason: WorldDealDmgActionReasonEnum.ATTACK,
    })

    if (
      hasComponentsByType(getAttackWeapon(source), BleedingEffectComponent) ||
      hasComponentsByType(source, BleedingEffectComponent)
    ) {
      action.addPendingImmediateAction({
        type: WorldActionTypeEnum.WORLD_INIT_BLEED,
        sourceId: source.id,
        targetId: mob.id,
      })
    }
  })()

  return action.resolve()
}
