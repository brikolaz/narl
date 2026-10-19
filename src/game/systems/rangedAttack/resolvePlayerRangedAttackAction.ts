import { assert } from "../../../utils/assert"
import { hasMobs } from "../mobs/mobs"
import { getPlayer } from "../player/player"
import { getPosition, getNextPosition } from "../position/position"
import { getTile } from "../world/tile"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getAttackWeapon } from "../attack/getAttackWeapon"
import {
  PlayerActionTypeEnum,
  type PlayerRangedAttackAction,
} from "../player/types"
import { canPierce, getPierceRange } from "./pierce"

export const resolvePlayerRangedAttackAction = (
  gameAction: PlayerRangedAttackAction,
): ActionResolution => {
  const action = new Action(gameAction)
  const { direction } = gameAction

  ;(() => {
    const source = getPlayer()
    const sourcePosition = getPosition(source)

    const weapon = assert(
      getAttackWeapon(source),
      "Can't do ranged attack without a weapon",
    )

    assert(canPierce(weapon), "Weapon can't pierce")

    const pierceRange = getPierceRange(weapon)

    const positionsToPierce: number[] = []

    let currentPosition = sourcePosition

    for (let distance = 1; distance <= pierceRange; distance += 1) {
      const nextPosition = getNextPosition({
        currentPosition,
        direction,
      })

      if (nextPosition === null) {
        break
      }

      positionsToPierce.push(nextPosition)
      currentPosition = nextPosition
    }

    const targetPositions = positionsToPierce.filter((position) =>
      hasMobs(getTile(position)),
    )

    if (targetPositions.length === 0) {
      return action.fail("ATTACK.NO_TARGET")
    }

    for (const targetPosition of targetPositions) {
      action.addPendingImmediateAction({
        type: PlayerActionTypeEnum.PLAYER_MELEE_ATTACK,
        targetPosition,
      })
    }
  })()

  return action.resolve()
}
