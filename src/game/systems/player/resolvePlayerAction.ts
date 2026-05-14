
import type { GameState } from "../../state/state";
import type { ActionResolution } from "../actions/types";
import { playerActionResolvers } from "./resolvers";
import { type PlayerAction } from "./types";

export const resolvePlayerAction = (
  state: GameState,
  action: PlayerAction,
): ActionResolution => {
      const actionResolution = (
        playerActionResolvers[action.type] as (
          state: GameState,
          playerAction: typeof action,
        ) => ActionResolution
      )(state, action);
      return actionResolution
};
