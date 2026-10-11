import { getPlayer } from "../player/player"
import { getPosition } from "../position/position"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getNextPosition } from "../movement/position"
import { PlayerActionTypeEnum, type PlayerAttackAction } from "../player/types"
import { WorldActionTypeEnum } from "../world/types"
import { canPierce } from "../rangedAttack/pierce"
import { getAttackWeapon } from "./getAttackWeapon"
import { hasComponentsByType } from "../../../core/model/queries/components/has"
import { BleedingEffectComponent } from "../../model/components/combat/BleedingEffectComponent"
import { getMob } from "../mobs/mobs"
import { getTile } from "../world/tile"

export const resolvePlayerAttackAction = (
  gameAction: PlayerAttackAction,
): ActionResolution => {
  const action = new Action(gameAction)
  const { direction } = gameAction
  ;(() => {
    const source = getPlayer()
    const targetPosition = getNextPosition({
      currentPosition: getPosition(source),
      direction,
    })

    const weapon = getAttackWeapon(source)

    if (!weapon) {
      return action.addPendingImmediateAction({
        type: WorldActionTypeEnum.WORLD_POKE,
        sourceId: source.id,
        direction,
      })
    }

    if (canPierce(weapon)) {
      return action.addPendingImmediateAction({
        type: PlayerActionTypeEnum.PLAYER_RANGED_ATTACK,
        direction,
      })
    }

    if (targetPosition === null) {
      return action.fail("Nothing to attack")
    }
    action.addPendingImmediateAction({
      type: PlayerActionTypeEnum.PLAYER_MELEE_ATTACK,
      targetPosition,
    })
    if (
      hasComponentsByType(weapon, BleedingEffectComponent) ||
      hasComponentsByType(source, BleedingEffectComponent)
    ) {
      action.addPendingImmediateAction({
        type: WorldActionTypeEnum.WORLD_INIT_BLEED,
        sourceId: source.id,
        targetId: getMob(getTile(targetPosition)).id,
      })
    }
  })()

  return action.resolve()
}
