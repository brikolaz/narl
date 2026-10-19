import { getEntityById } from "../../../core/model/queries/entities/get"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { WorldGainExpAction } from "../world/types"
import { addExp } from "./exp"

export const resolveWorldGainExpAction = (
  gameAction: WorldGainExpAction,
): ActionResolution => {
  const action = new Action(gameAction)
  const { exp, targetEntityId } = gameAction

  ;(() => {
    const target = getEntityById(targetEntityId)

    if (!target || exp === 0) {
      return
    }

    addExp(target, exp)
    action.info("EXP.GAINED", exp)
  })()

  return action.resolve()
}
