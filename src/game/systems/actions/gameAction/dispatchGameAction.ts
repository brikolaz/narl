import type { Id } from "../../../../core/model/Id";
import { STATE, type GameState } from "../../../state/state";
import { flushLogs, recordPlayerAction } from "../../log/log";
import type { PendingLog } from "../../log/types";
import { isPlayerAction } from "../../player/guards";
import { increaseTurn } from "../../turn/turn";
import { runWorldTurn } from "../../world/turn/runWorldTurn";
import { applyTimedAction, dequeueTimedActions } from "../timedActions/timedActions";
import type { TimedAction } from "../timedActions/types";
import type { ActionResolution, GameAction } from "../types";
import { resolveGameAction } from "./resolveGameAction";

type DrainedResolution = {
  consumesTurn: boolean;
};

type DrainContext = {
  pendingLogs: PendingLog[];
  processedActions: Set<Id>;
};

const drainResolution = (
  resolution: ActionResolution,
  context: DrainContext,
): DrainedResolution => {
  let consumesTurn = resolution.consumesTurn;

  context.pendingLogs.push(...resolution.pendingLogs);

  for (const pendingAction of resolution.pendingActions) {
    context.processedActions.add(pendingAction.id);

    const pendingResolution = applyTimedAction(pendingAction);

    if (!pendingResolution) {
      continue;
    }

    const result = drainResolution(pendingResolution, context);

    consumesTurn ||= result.consumesTurn;
  }

  return {
    consumesTurn,
  };
};

const drainAction = (
  action: GameAction,
  context: DrainContext,
): DrainedResolution => {
  const resolution = resolveGameAction(action);

  return drainResolution(resolution, context);
};

const drainDequeuedAction = (
  timedAction: TimedAction,
  context: DrainContext,
): DrainedResolution => {
  context.processedActions.add(timedAction.id);

  return drainAction(timedAction.action, context);
};

export const dispatchGameAction = (action: GameAction): GameState => {
  const context: DrainContext = {
    pendingLogs: [],
    processedActions: new Set(),
  };

  if (isPlayerAction(action)) {
    recordPlayerAction(action);
  }

  const actionResult = drainAction(action, context);
  let consumesTurn = actionResult.consumesTurn;

  if (consumesTurn) {
    for (const worldAction of runWorldTurn()) {
      const worldResult = drainAction(worldAction, context);

      consumesTurn ||= worldResult.consumesTurn;
    }

    const dequeuedActions = dequeueTimedActions([...context.processedActions]);

    for (const timedAction of dequeuedActions) {
      const timedResult = drainDequeuedAction(timedAction, context);

      consumesTurn ||= timedResult.consumesTurn;
    }
  }

  flushLogs(context.pendingLogs, consumesTurn);

  if (consumesTurn) {
    STATE.turn = increaseTurn(STATE.turn);
  }

  return STATE;
};
