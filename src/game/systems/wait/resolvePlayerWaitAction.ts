import { getEntityLogProjection } from "../log/getEntityLogProjection"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getPlayer } from "../player/player"
import type { PlayerWaitAction } from "../player/types"
import { WorldActionTypeEnum } from "../world/types"
import { isSafe } from "./combat"

export const resolvePlayerWaitAction = (
  gameAction: PlayerWaitAction,
): ActionResolution => {
  const action = new Action(gameAction)

  ;(() => {
    const player = getPlayer()

    if (!isSafe()) {
      return action.addPendingImmediateAction({
        type: WorldActionTypeEnum.WORLD_INIT_BLOCK,
        entityId: player.id,
      })
    }

    action.success("ENTITY.WAIT", getEntityLogProjection(player))
    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_REST,
      entityId: player.id,
    })
  })()

  return action.resolve(true)
}
