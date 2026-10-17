import { ACTION_RESOLVERS } from "./resolvers"
import type { ActionResolution, GameAction, GameActionOfType } from "../types"

export const resolveGameAction = <Type extends GameAction["type"]>(
  action: GameActionOfType<Type>,
): ActionResolution => {
  const actionResolution = ACTION_RESOLVERS[action.type](action)

  if (!actionResolution) {
    throw new Error("Invalid game action")
  }

  return actionResolution
}
