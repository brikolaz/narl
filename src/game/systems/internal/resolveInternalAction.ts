import type { ActionResolution } from "../actions/types";
import { internalActionResolvers } from "./resolvers";
import type { InternalAction } from "./type";

export const resolveInternalAction = (
  gameAction: InternalAction,
): ActionResolution => {
  const actionResolution = (
    internalActionResolvers[gameAction.type] as (
      internalAction: typeof gameAction,
    ) => ActionResolution
  )(gameAction);
  return actionResolution;
};
