import type { GameState } from "../../../../state";
import { runWorldTurn } from "../../runWorldTurn";
import type { GameAction } from "../types";
import { resolveGameAction } from "./resolveGameAction";

export const dispatchGameAction =
  (action: GameAction) => (state: GameState) => {
    let currentState = state;
    const queue: GameAction[] = [action];
    let consumesTurn = false;

    while (queue.length) {
      const currentAction = queue.shift() as GameAction;

      const resolution = resolveGameAction(currentState, currentAction);

      currentState = resolution.nextState;
      consumesTurn = consumesTurn || resolution.consumesTurn;

      queue.push(...resolution.pendingActions);
    }

    if (!consumesTurn) {
      return currentState;
    }

    const afterWorldTurn = runWorldTurn(currentState);

    return {
      ...afterWorldTurn,
      turn: state.turn + 1,
    };
  };
