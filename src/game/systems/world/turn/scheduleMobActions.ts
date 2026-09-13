import type { GameAction } from "../../actions/types"
import { getAllMobs } from "../../mobs/mobs"
import { getPlayer } from "../../player/player"
import { getPosition } from "../../position/position"
import { WorldActionTypeEnum } from "../types"

export const enqueueMobActions = () => {
  const nextQueue: GameAction[] = []
  const playerPosition = getPosition(getPlayer())
  const mobs = getAllMobs().toSorted(
    (a, b) =>
      Math.abs(getPosition(a) - playerPosition) -
      Math.abs(getPosition(b) - playerPosition),
  )

  for (const mob of mobs) {
    nextQueue.push({
      type: WorldActionTypeEnum.WORLD_MOB_AI,
      mobId: mob.id,
    })
  }

  return nextQueue
}
