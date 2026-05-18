import type { GameState } from "../../state/state";
import type { ActionResolution } from "../actions/types";
import { internalActionResolvers } from "./resolvers";
import type { InternalAction } from "./type";

export const resolveInternalAction = (
  state: GameState,
  gameAction: InternalAction,
): ActionResolution => {
  const actionResolution = (
    internalActionResolvers[gameAction.type] as (
      state: GameState,
      internalAction: typeof gameAction,
    ) => ActionResolution
  )(state, gameAction);
  return actionResolution;
};
