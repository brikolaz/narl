import { getEntityById } from "../../../core/model/queries/entities/get"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getPosition } from "../position/position"
import type { WorldInspectAction } from "../world/types"
import { STATE } from "../../state"
import { poke } from "./poke"

export const resolveWorldInspectAction = (
  gameAction: WorldInspectAction,
): ActionResolution => {
  const action = new Action(gameAction)
  const { sourceId, targetPosition } = gameAction

  ;(() => {
    const source = getEntityById(sourceId)
    const tile = STATE.world[targetPosition]
    if (
      !source ||
      !tile ||
      Math.abs(getPosition(source) - targetPosition) > 1
    ) {
      return action.fail("POKE.NO_TARGET")
    }

    poke(action, source, tile, gameAction.floorOnly)
  })()

  return action.resolve()
}
