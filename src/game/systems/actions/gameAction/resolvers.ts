import type { ActionResolverMap, GameAction } from "../types"
import { INTERNAL_ACTION_RESOLVERS } from "../../internal/resolvers"
import { PLAYER_ACTION_RESOLVERS } from "../../player/resolvers"
import { WORLD_ACTION_RESOLVERS } from "../../world/resolvers"

export const ACTION_RESOLVERS = {
  ...INTERNAL_ACTION_RESOLVERS,
  ...PLAYER_ACTION_RESOLVERS,
  ...WORLD_ACTION_RESOLVERS,
} satisfies ActionResolverMap<GameAction>
