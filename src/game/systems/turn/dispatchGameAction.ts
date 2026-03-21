import type { GameState } from "../../state/state";
import type { GameAction } from "./types";
import { resolvePlayerAction } from "./resolvePlayerAction";
import { runWorldTurn } from "./runWorldTurn";

export function dispatchGameAction(
    state: GameState,
    action: GameAction
): GameState {
    const resolution = resolvePlayerAction(state, action);

    if (!resolution.consumesTurn) {
        return resolution.nextState;
    }

    const afterWorldTurn = runWorldTurn(resolution.nextState);

    return {
        ...afterWorldTurn,
        turn: state.turn + 1,
    };
}