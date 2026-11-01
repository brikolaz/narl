import { GameStatusEnum, STATE } from "../../state"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { InternalInitAction } from "../internal/types"
import { initGame } from "./initGame"

export const resolveInternalInitAction = (
  gameAction: InternalInitAction,
): ActionResolution => {
  const action = new Action(gameAction)

  if (STATE.status !== GameStatusEnum.INACTIVE) {
    throw new Error("Can't reinitialize the game")
  }

  ;(() => {
    initGame()
    action.info("GAME.STAY_DEAD")
  })()

  return action.resolve()
}
