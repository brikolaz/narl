// game/systems/input/mapKeyboardEventToAction.ts
import { Direction, GameActionType, type GameAction } from "../../turn";

export const mapKeyboardEventToAction = (
    event: KeyboardEvent
): GameAction | undefined => {
    switch (event.key) {
        case "ArrowLeft":
            return { type: GameActionType.MOVE, direction: Direction.LEFT };
        case "ArrowRight":
            return { type: GameActionType.MOVE, direction: Direction.RIGHT };
        case "g":
        case "G":
            return { type: GameActionType.PICK_UP };
        default:
            return undefined;
    }
};