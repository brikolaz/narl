import { ACTION_RESOLVERS } from "./resolvers"
import type { ActionResolution, GameAction } from "../types"

export const resolveGameAction = (action: GameAction): ActionResolution => {
  const actionResolution = (
    ACTION_RESOLVERS[action.type] as (
      internalAction: typeof action,
    ) => ActionResolution
  )(action) // TODO: remove assertion

  if (!actionResolution) {
    throw new Error("Invalid game action")
  }

  return actionResolution
}
