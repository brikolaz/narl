import type { Entity } from "../../../../core/model/Entity"
import { isAdjacent } from "../../../../utils/adjacent"
import type { GameAction } from "../../actions/types"
import { isFriendlyHostile } from "../../attack/hostility"
import { getAllMobs } from "../../mobs/mobs"
import { getDirection } from "../../movement/position"
import { getPlayer } from "../../player/player"
import { getPosition } from "../../position/position"
import { WorldActionTypeEnum } from "../../world/types"

const getMobTowardsPlayer = (mob: Entity): Entity | undefined => {
  const directionToPlayer = getDirection(mob, getPlayer())
  const sourcePosition = getPosition(mob)

  return getAllMobs().find(
    (target) =>
      target.id !== mob.id &&
      isAdjacent(sourcePosition, getPosition(target)) &&
      getDirection(mob, target) === directionToPlayer,
  )
}

export const friendlyAttack = (mob: Entity): GameAction | undefined => {
  if (!isFriendlyHostile(mob)) {
    return
  }

  const target = getMobTowardsPlayer(mob)
  if (!target) {
    return
  }

  return {
    type: WorldActionTypeEnum.WORLD_ATTACK,
    sourceId: mob.id,
    targetId: target.id,
  }
}
