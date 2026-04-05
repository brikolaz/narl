import type { GameState } from "../../state/state";
import type { ActionResolution } from "../turn";
import { addLog } from "./addLog";

const resolveAction = (state: GameState, message: string, consumesTurn: boolean): ActionResolution<GameState> => {
    const nextState = addLog(state, {
        message,
        turn: state.turn
    });

    return {
        nextState,
        consumesTurn,
    };
}

export const rejectAction = (state: GameState, message: string, consumesTurn: boolean): ActionResolution<GameState> => {
    return resolveAction(state, message, consumesTurn);
}

export const fulfillAction = (state: GameState, message: string, consumesTurn: boolean): ActionResolution<GameState> => {
    return resolveAction(state, message, consumesTurn);
}