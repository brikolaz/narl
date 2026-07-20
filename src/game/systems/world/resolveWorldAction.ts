import type { WorldAction } from "./types";
import type { ActionResolution } from "../actions/types";
import { worldActionResolvers } from "./resolvers";

export const resolveWorldAction = (
  gameAction: WorldAction,
): ActionResolution => {
  const actionResolution = (
    worldActionResolvers[gameAction.type] as (
      worldAction: typeof gameAction,
    ) => ActionResolution
  )(gameAction);
  return actionResolution;
};
