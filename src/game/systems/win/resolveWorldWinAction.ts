import { GameStatusEnum, STATE } from "../../state/state"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { WorldWinAction } from "../world/types"

export const isWin = () => STATE.status === GameStatusEnum.WIN

export const resolveWorldWinAction = (
  gameAction: WorldWinAction,
): ActionResolution => {
  const action = new Action(gameAction)

  ;(() => {
    STATE.status = GameStatusEnum.WIN
  })()

  return action.resolve()
}
