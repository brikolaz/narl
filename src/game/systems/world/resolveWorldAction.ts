import type { GameState } from "../../state/state";
import type { WorldAction } from "../actions/gameAction/types";
import type { ActionResolution } from "../actions/types";
import { worldActionResolvers } from "./resolvers";

export const resolveWorldAction = (
  state: GameState,
  action: WorldAction,
): ActionResolution => {
  const actionResolution = (
    worldActionResolvers[action.type] as (
      state: GameState,
      worldAction: typeof action,
    ) => ActionResolution
  )(state, action);
  return actionResolution;
};
