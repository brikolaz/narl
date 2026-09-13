import type { Entity } from "../../../../core/model/Entity"
import { isAdjacent } from "../../../../utils/adjacent"
import { getPlayer } from "../../player/player"
import { getPosition } from "../../position/position"
import type { GameAction } from "../../actions/types"
import { isHostile } from "../../attack/hostility"
import { WorldActionTypeEnum } from "../../world/types"

export const canAttack = (mob: Entity) =>
  isHostile(mob) && isAdjacent(getPosition(getPlayer()), getPosition(mob))

export const attack = (mob: Entity): GameAction | undefined => {
  if (canAttack(mob)) {
    return {
      type: WorldActionTypeEnum.WORLD_ATTACK,
      sourceId: mob.id,
      targetId: getPlayer().id,
    }
  }
}
