import { poke } from "../inspect/poke"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getNextPosition, getPosition } from "../position/position"
import type { WorldPokeAction } from "../world/types"
import { getTile } from "../world/tile"

export const resolveWorldPokeAction = (
  gameAction: WorldPokeAction,
): ActionResolution => {
  const action = new Action(gameAction)
  const { sourceId, direction } = gameAction

  ;(() => {
    const source = getEntityById(sourceId)
    if (!source) {
      return action.fail("POKE.NO_TARGET")
    }

    const targetPosition = getNextPosition({
      currentPosition: getPosition(source),
      direction,
    })
    if (targetPosition === null) {
      return action.fail("POKE.NO_TARGET")
    }

    poke(action, source, getTile(targetPosition))
  })()

  return action.resolve()
}
