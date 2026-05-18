import type { GameState } from "../../../state/state";
import { flushLogs } from "../../log/log";
import type { PendingLog } from "../../log/types";
import { runWorldTurn } from "../../turn/runWorldTurn";
import { increaseTurn } from "../../turn/turn";
import type { GameAction } from "../types";
import { resolveGameAction } from "./resolveGameAction";

export const dispatchGameAction =
  (action: GameAction) =>
  (state: GameState): GameState => {
    let currentState = state;
    const queue: GameAction[] = [action];
    let consumesTurn = false;
    const pendingLogs: PendingLog[] = [];

    while (queue.length) {
      const currentAction = queue.shift() as GameAction;

      const resolution = resolveGameAction(currentState, currentAction);

      currentState = resolution.nextState;
      consumesTurn = consumesTurn || resolution.consumesTurn;

      pendingLogs.push(...resolution.pendingLogs);
      queue.push(...resolution.pendingActions);
    }

    const afterWorldTurn = runWorldTurn(currentState);
    const afterFlushLogs = flushLogs(afterWorldTurn, pendingLogs, consumesTurn);

    return {
      ...afterFlushLogs,
      turn: consumesTurn
        ? increaseTurn(afterWorldTurn.turn)
        : afterWorldTurn.turn,
    };
  };
