import type { GameState } from "../../state/state";
import { resolveMoveAction } from "../movement";
import { resolvePickUpAction } from "../pickUp/resolvePickUpAction";
import { GameActionType, type ActionResolution, type GameAction } from "./types";

export const resolvePlayerAction = (
    state: GameState,
    action: GameAction
): ActionResolution<GameState> => {
    switch (action.type) {
        case GameActionType.MOVE:
            return resolveMoveAction(state, action.direction);
        case GameActionType.PICK_UP:
            return resolvePickUpAction(state);
        default:
            return {
                nextState: state,
                consumesTurn: false,
            };
    }
}