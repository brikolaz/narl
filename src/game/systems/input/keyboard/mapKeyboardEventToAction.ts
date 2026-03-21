// game/systems/input/mapKeyboardEventToAction.ts
import { Direction, type GameAction } from "../../turn";

export function mapKeyboardEventToAction(
    event: KeyboardEvent
): GameAction | undefined {
    switch (event.key) {
        case "ArrowLeft":
            return { type: "move", direction: Direction.LEFT };
        case "ArrowRight":
            return { type: "move", direction: Direction.RIGHT };
        default:
            return undefined;
    }
}