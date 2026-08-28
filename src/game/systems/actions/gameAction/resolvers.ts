import type { ActionResolverMap, GameAction } from "../types";
import { internalActionResolvers } from "../../internal/resolvers";
import { playerActionResolvers } from "../../player/resolvers";
import { worldActionResolvers } from "../../world/resolvers";

export const actionResolvers = {
  ...internalActionResolvers,
  ...playerActionResolvers,
  ...worldActionResolvers
} satisfies ActionResolverMap<GameAction>;
