import type { GameState } from "../../../state/state";
import { flushLogs, recordPlayerAction } from "../../log/log";
import type { PendingLog } from "../../log/types";
import { isPlayerAction } from "../../player/guards";
import { increaseTurn } from "../../turn/turn";
import { runWorldTurn } from "../../world/turn/runWorldTurn";
import type { GameAction } from "../types";
import { resolveGameAction } from "./resolveGameAction";

const drainAction = (
  state: GameState,
  action: GameAction,
  pendingLogs: PendingLog[],
): { nextState: GameState; consumesTurn: boolean } => {
  const resolution = resolveGameAction(state, action);

  let nextState = resolution.nextState;
  let consumesTurn = resolution.consumesTurn;

  pendingLogs.push(...resolution.pendingLogs);

  for (const pendingAction of resolution.pendingActions) {
    const childResult = drainAction(nextState, pendingAction, pendingLogs);

    nextState = childResult.nextState;
    consumesTurn = consumesTurn || childResult.consumesTurn;
  }

  return { nextState, consumesTurn };
};

export const dispatchGameAction =
  (state: GameState) =>
  (action: GameAction): GameState => {
    let nextState = state;
    let consumesTurn = false;
    const pendingLogs: PendingLog[] = [];

    if (isPlayerAction(action)) {
      nextState = recordPlayerAction(nextState, action);
    }

    const actionResult = drainAction(nextState, action, pendingLogs);
    nextState = actionResult.nextState;
    consumesTurn = consumesTurn || actionResult.consumesTurn;

    if (consumesTurn) {
      const worldActions = runWorldTurn(nextState);

      for (const worldAction of worldActions) {
        const worldResult = drainAction(nextState, worldAction, pendingLogs);
        nextState = worldResult.nextState;
        consumesTurn = consumesTurn || worldResult.consumesTurn;
      }
    }

    const afterFlushLogs = flushLogs(nextState, pendingLogs, consumesTurn);

    return {
      ...afterFlushLogs,
      turn: consumesTurn ? increaseTurn(nextState.turn) : nextState.turn,
    };
  };
