import { assert } from "../../../utils/assert"
import { getMob, hasMobs } from "../mobs/mobs"
import { getPlayer } from "../player/player"
import { getTile } from "../world/tile"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { rollAttackDmg } from "../attack/dmg"
import type { PlayerMeleeAttackAction } from "../player/types"
import {
  WorldActionTypeEnum,
  WorldDealDamageActionReasonEnum,
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
      return action.fail("Nothing to attack")
    }
    const mob = assert(getMob(target), "No mob to attack")
    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_DEAL_DAMAGE,
      sourceId: source.id,
      targetId: mob.id,
      dmg: rollAttackDmg(source),
      reason: WorldDealDamageActionReasonEnum.ATTACK,
    })
  })()

  return action.resolve()
}
