import { MAP_SIZE } from "../../../utils/constants";
import { Direction } from "../turn";

type GetNextPlayerPositionParams = {
    currentPosition: number;
    direction: Direction;
    tilesCount: number;
};

export function getNextPlayerPosition({
    currentPosition,
    direction,
}: GetNextPlayerPositionParams): number | null {
    const delta = direction === Direction.LEFT ? -1 : 1;
    const nextPosition = currentPosition + delta;

    if (nextPosition < 0 || nextPosition >= MAP_SIZE) {
        return null;
    }

    return nextPosition;
}