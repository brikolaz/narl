import { STATE } from "../../state/state";
import type { ActionResolution, GameAction } from "../actions/types";
import type { Effect, TimedEffect } from "./types";
import { effectResolvers } from "./resolvers";
import type { Id } from "../../../core/ecs/Id";

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

export const enqueueEffect = (pendingEffect: TimedEffect): void => {
  if (pendingEffect.turns === undefined) {
    throw new Error("Can't schedule effect with no delay");
  }
  STATE.timedEffects.push(pendingEffect);
};

export const applyPendingEffect = (
  pendingEffect: TimedEffect,
): ActionResolution | undefined => {
  if (!pendingEffect.immediate) {
    if (pendingEffect.turns === 0) {
      return applyEffect(pendingEffect.action, pendingEffect.effect);
    }
    enqueueEffect(pendingEffect);
    return;
  }
  const actionResolution: ActionResolution = applyEffect(
    pendingEffect.action,
    pendingEffect.effect,
  );
  if (pendingEffect.turns === 0) {
    return actionResolution;
  }
  enqueueEffect({ ...pendingEffect, turns: pendingEffect.turns - 1 });
  return actionResolution;
};

export const dequeueEffects = (processedEffects: Id[] = []): TimedEffect[] => {
  const effectsToApply: TimedEffect[] = [];
  STATE.timedEffects = STATE.timedEffects
    .map((timedEffect) => {
      if (processedEffects.includes(timedEffect.id)) {
        return timedEffect;
      }
      const { id, action, effect, immediate, turns } = timedEffect;
      if (immediate) {
        effectsToApply.push(timedEffect);
        if (turns === 0) {
          return undefined;
        }
      } else if (turns === 0) {
        effectsToApply.push(timedEffect);
        return undefined;
      }

      return {
        id,
        action,
        effect,
        immediate,
        turns: turns - 1,
      };
    })
    .filter((timedEffect) => timedEffect !== undefined);

  return effectsToApply;
};
