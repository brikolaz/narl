import type { GameState } from "../../state/state";
import type { ActionResolution } from "../actions/types";
import { playerActionResolvers } from "./resolvers";
import { type PlayerAction } from "./types";

export const resolvePlayerAction = (
  state: GameState,
  gameAction: PlayerAction,
): ActionResolution => {
  const actionResolution = (
    playerActionResolvers[gameAction.type] as (
      state: GameState,
      playerAction: typeof gameAction,
    ) => ActionResolution
  )(state, gameAction);
  return actionResolution;
};
