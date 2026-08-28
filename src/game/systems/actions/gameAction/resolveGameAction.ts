import { actionResolvers } from "./resolvers";
import type { ActionResolution, GameAction } from "../types";

export const resolveGameAction = (
  action: GameAction,
): ActionResolution => {
  const actionResolution = (
    actionResolvers[action.type] as (
      internalAction: typeof action,
    ) => ActionResolution
  )(action); // TODO: remove assertion
  
  if(!actionResolution) {
    throw new Error("Invalid game action");
  }
  
  return actionResolution;
};
