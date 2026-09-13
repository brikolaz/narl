import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import {
  InternalActionTypeEnum,
  type InternalResetGameAction,
} from "../internal/types"
import { GameStatusEnum, initState, STATE } from "../../state/state"

export const resolveInternalResetGameAction = (
  gameAction: InternalResetGameAction,
): ActionResolution => {
  const action = new Action(gameAction)

  ;(() => {
    if (
      STATE.status !== GameStatusEnum.GAME_OVER &&
      STATE.status !== GameStatusEnum.WIN
    ) {
      throw new Error("Can't reset an active game")
    }

    initState()
    action.addPendingImmediateAction({
      type: InternalActionTypeEnum.INTERNAL_INIT,
    })
  })()

  return action.resolve()
}
