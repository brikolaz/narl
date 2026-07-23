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

const drainResolution = (
  action: GameAction,
  resolution: ActionResolution,
  pendingLogs: PendingLog[],
): DrainedResolution => {
  let consumesTurn = resolution.consumesTurn;

  pendingLogs.push(...resolution.pendingLogs);

  let effectIndex = 0;
  const processedEffects: Id[] = [];

  while (effectIndex < resolution.pendingEffects.length) {
    const pendingEffect = resolution.pendingEffects[effectIndex];
    const effectResolution = applyPendingEffect(pendingEffect);

    if (effectResolution) {
      const effectResult = drainResolution(
        action,
        effectResolution,
        pendingLogs,
      );

      consumesTurn ||= effectResult.consumesTurn;
    }
    effectIndex++;
    processedEffects.push(pendingEffect.id);
  }

  let actionIndex = 0;

  while (actionIndex < resolution.pendingActions.length) {
    const pendingAction = resolution.pendingActions[actionIndex];

    const actionResult = drainAction(pendingAction, pendingLogs);

    consumesTurn ||= actionResult.consumesTurn;
    actionIndex++;
  }

  return { consumesTurn, processedEffects };
};

const drainAction = (
  action: GameAction,
  pendingLogs: PendingLog[],
): DrainedResolution => {
  const resolution = resolveGameAction(action);

  return drainResolution(action, resolution, pendingLogs);
};

export const dispatchGameAction = (action: GameAction): GameState => {
  let consumesTurn = false;
  const pendingLogs: PendingLog[] = [];

  if (isPlayerAction(action)) {
    recordPlayerAction(action);
  }

  const actionResult = drainAction(action, pendingLogs);

  consumesTurn ||= actionResult.consumesTurn;

  if (actionResult.consumesTurn) {
    dequeueEffects(actionResult.processedEffects);
  }

  if (consumesTurn) {
    const worldActions = runWorldTurn();

    for (const worldAction of worldActions) {
      const worldResult = drainAction(worldAction, pendingLogs);

      consumesTurn ||= worldResult.consumesTurn;
    }
  }

  flushLogs(pendingLogs, consumesTurn);

  STATE.turn = consumesTurn ? increaseTurn(STATE.turn) : STATE.turn;

  return STATE;
};
