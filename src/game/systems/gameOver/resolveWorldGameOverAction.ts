import { GameStatusEnum, STATE } from "../../state/state"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { WorldGameOverAction } from "../world/types"

export const resolveWorldGameOverAction = (
  gameAction: WorldGameOverAction,
): ActionResolution => {
  const action = new Action(gameAction)

  ;(() => {
    if (STATE.status !== GameStatusEnum.PENDING_GAME_OVER) {
      throw new Error("Game over has not been initialized")
    }
    STATE.status = GameStatusEnum.GAME_OVER
  })()

  return action.resolve()
}
