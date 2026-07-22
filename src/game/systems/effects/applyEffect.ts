import type { ActionResolution, GameAction } from "../actions/types";
import type { Effect } from "./effects";
import { effectResolvers } from "./resolvers";

export const applyEffect = (
  action: GameAction,
  gameEffect: Effect,
): ActionResolution => {

  const actionResolution = (
    effectResolvers[gameEffect.type] as (
      action: GameAction,
      effect: typeof gameEffect,
    ) => ActionResolution
  )(action, gameEffect);
  if (!actionResolution) {
    throw new Error("Invalid effect");
  }
  return actionResolution;
};
