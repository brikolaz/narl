import type { ActionResolution } from "../actions/types";
import { playerActionResolvers } from "./resolvers";
import { type PlayerAction } from "./types";

export const resolvePlayerAction = (
  gameAction: PlayerAction,
): ActionResolution => {
  const actionResolution = (
    playerActionResolvers[gameAction.type] as (
      playerAction: typeof gameAction,
    ) => ActionResolution
  )(gameAction);
  return actionResolution;
};
