import type { GameState } from "../../../state/state";
import { flushLogs } from "../../log/log";
import type { PendingLog } from "../../log/types";
import { runWorldTurn } from "../../world/turn/runWorldTurn";
import { increaseTurn } from "../../turn/turn";
import type { GameAction } from "../types";
import { resolveGameAction } from "./resolveGameAction";

const drainQueue = (
  state: GameState,
  queue: GameAction[],
  pendingLogs: PendingLog[],
) => {
  let nextState = state;
  let consumesTurn = false;

  while (queue.length) {
    const currentAction = queue.shift() as GameAction;
    const resolution = resolveGameAction(nextState, currentAction);

    nextState = resolution.nextState;
    consumesTurn = consumesTurn || resolution.consumesTurn;
    pendingLogs.push(...resolution.pendingLogs);
    queue.push(...resolution.pendingActions);
  }

  return { nextState, consumesTurn };
};

export const dispatchGameAction =
  (action: GameAction) =>
  (state: GameState): GameState => {
    let nextState = state;
    const queue: GameAction[] = [action];
    let consumesTurn = false;
    const pendingLogs: PendingLog[] = [];

    const playerResult = drainQueue(nextState, queue, pendingLogs);
    nextState = playerResult.nextState;
    consumesTurn = consumesTurn || playerResult.consumesTurn;

    if (consumesTurn) {
      const worldActions = runWorldTurn(nextState);
      for (let i = 0; i < worldActions.length; i++) {
        queue.push(worldActions[i]);
        const worldResult = drainQueue(nextState, queue, pendingLogs);
        nextState = worldResult.nextState;
      }
    }

    const afterFlushLogs = flushLogs(nextState, pendingLogs, consumesTurn);

    return {
      ...afterFlushLogs,
      turn: consumesTurn ? increaseTurn(nextState.turn) : nextState.turn,
    };
  };
