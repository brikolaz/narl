import { getPlayer } from "../player/player"
import { getPosition } from "../position/position"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getNextPosition } from "../movement/position"
import { PlayerActionTypeEnum, type PlayerAttackAction } from "../player/types"
import { WorldActionTypeEnum } from "../world/types"
import { canPierce } from "../rangedAttack/pierce"
import { getAttackWeapon } from "./getAttackWeapon"

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
  })()

  return action.resolve()
}
