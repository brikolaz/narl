import type { GameState } from "../../state/state";
import { resolveMoveAction } from "../movement";
import type { ActionResolution, GameAction } from "./types";

export function resolvePlayerAction(
    state: GameState,
    action: GameAction
): ActionResolution<GameState> {
    switch (action.type) {
        case "move":
            return resolveMoveAction(state, action.direction);
        default: {
            return {
                nextState: state,
                consumesTurn: false,
            };
        }
    }
}