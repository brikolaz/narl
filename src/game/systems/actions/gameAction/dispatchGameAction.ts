import type { Id } from "../../../../core/ecs/Id";
import { STATE, type GameState } from "../../../state/state";
import { applyPendingEffect, dequeueEffects } from "../../effects/effects";
import type { TimedEffect } from "../../effects/types";
import { flushLogs, recordPlayerAction } from "../../log/log";
import type { PendingLog } from "../../log/types";
import { isPlayerAction } from "../../player/guards";
import { increaseTurn } from "../../turn/turn";
import { runWorldTurn } from "../../world/turn/runWorldTurn";
import type { ActionResolution, GameAction } from "../types";
import { resolveGameAction } from "./resolveGameAction";

type DrainedResolution = {
  consumesTurn: boolean;
  processedEffects: Id[];
};

const drainEffects = (
  action: GameAction,
  effects: TimedEffect[],
  pendingLogs: PendingLog[],
): DrainedResolution => {
  let consumesTurn = false;
  const processedEffects: Id[] = [];

  for (const pendingEffect of effects) {
    const effectResolution = applyPendingEffect(pendingEffect);

    processedEffects.push(pendingEffect.id);

    if (!effectResolution) {
      continue;
    }

    const result = drainResolution(action, effectResolution, pendingLogs);

    consumesTurn ||= result.consumesTurn;
    processedEffects.push(...result.processedEffects);
  }

  return {
    consumesTurn,
    processedEffects,
  };
};

const drainResolution = (
  action: GameAction,
  resolution: ActionResolution,
  pendingLogs: PendingLog[],
): DrainedResolution => {
  let consumesTurn = resolution.consumesTurn;
  const processedEffects: Id[] = [];

  pendingLogs.push(...resolution.pendingLogs);

  const effectsResult = drainEffects(
    action,
    resolution.pendingEffects,
    pendingLogs,
  );

  consumesTurn ||= effectsResult.consumesTurn;
  processedEffects.push(...effectsResult.processedEffects);

  for (const pendingAction of resolution.pendingActions) {
    const actionResult = drainAction(pendingAction, pendingLogs);

    consumesTurn ||= actionResult.consumesTurn;
    processedEffects.push(...actionResult.processedEffects);
  }

  return {
    consumesTurn,
    processedEffects,
  };
};

const drainAction = (
  action: GameAction,
  pendingLogs: PendingLog[],
): DrainedResolution => {
  const resolution = resolveGameAction(action);

  return drainResolution(action, resolution, pendingLogs);
};

export const dispatchGameAction = (action: GameAction): GameState => {
  const pendingLogs: PendingLog[] = [];

  if (isPlayerAction(action)) {
    recordPlayerAction(action);
  }

  const actionResult = drainAction(action, pendingLogs);
  let consumesTurn = actionResult.consumesTurn;

  if (actionResult.consumesTurn) {
    const effectsToApply = dequeueEffects(actionResult.processedEffects);

    const effectsResult = drainEffects(action, effectsToApply, pendingLogs);

    consumesTurn ||= effectsResult.consumesTurn;
  }

  if (consumesTurn) {
    for (const worldAction of runWorldTurn()) {
      const worldResult = drainAction(worldAction, pendingLogs);
      consumesTurn ||= worldResult.consumesTurn;
    }
  }

  flushLogs(pendingLogs, consumesTurn);

  if (consumesTurn) {
    STATE.turn = increaseTurn(STATE.turn);
  }

  return STATE;
};
