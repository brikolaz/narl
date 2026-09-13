import type { Entity } from "../../../../core/model/Entity"
import { assert } from "../../../../utils/assert"
import { getPlayer } from "../../player/player"
import type { GameAction } from "../../actions/types"
import { isHostile } from "../../attack/hostility"
import { getDirection } from "../../movement/position"
import { WorldActionTypeEnum } from "../../world/types"
import { isAware } from "../aggro"
import { isInFov } from "../fov"
import { isMovable } from "../move"
import { canAttack } from "./attack"

const canMove = (mob: Entity) => {
  const player = getPlayer()

  return (
    !canAttack(mob) &&
    isHostile(mob) &&
    isMovable(mob) &&
    // hasPath(mob, player) &&
    isAware(mob) &&
    isInFov(mob, player)
  )
}

export const move = (mob: Entity): GameAction | undefined => {
  const player = getPlayer()
  if (canMove(mob)) {
    const direction = assert(getDirection(mob, player), "Invalid direction")
    return {
      type: WorldActionTypeEnum.WORLD_MOVE,
      entityId: mob.id,
      direction,
    }
  }
}
