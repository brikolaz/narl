import type { GameState } from "../../state/state";

export function runWorldTurn(state: GameState): GameState {
    let nextState = state;

    // runEnemyTurn etc goes here

    return nextState;
}