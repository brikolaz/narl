import type { Id } from "../../../../core/model/Id";
import { STATE, type GameState } from "../../../state/state";
import { flushLogs, recordPlayerAction } from "../../log/log";
import type { PendingLog } from "../../log/types";
import { isPlayerAction } from "../../player/guards";
import { increaseTurn } from "../../turn/turn";
import { runWorldTurn } from "../../world/turn/runWorldTurn";
import {
  applyTimedAction
} from "../timedActions/timedActions";
import type { TimedAction } from "../timedActions/types";
import type { ActionResolution, GameAction } from "../types";
import { resolveGameAction } from "./resolveGameAction";

export type DrainedResolution = {
  consumesTurn: boolean;
};

export type DrainContext = {
  pendingLogs: PendingLog[];
  processedActions: Set<Id>;
};

export const drainResolution = (
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

export const drainAction = (
  action: GameAction,
  context: DrainContext,
): DrainedResolution => {
  const resolution = resolveGameAction(action);

  return drainResolution(resolution, context);
};

export const drainDequeuedAction = (
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
  const consumesTurn = actionResult.consumesTurn;

  if (consumesTurn) {
    runWorldTurn(context);
  }

  flushLogs(context.pendingLogs, consumesTurn);

  if (consumesTurn) {
    STATE.turn = increaseTurn(STATE.turn);
  }

  return STATE;
};
