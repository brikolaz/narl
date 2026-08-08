import type { Entity } from "../../../core/model/Entity";
import { MAX_WORLD_SIZE } from "../../../utils/constants";
import { getPosition } from "../../model/queries/position";
import { Direction } from "../turn/types";

type GetNextPositionParams = {
  currentPosition: number;
  direction: Direction;
};

export const getDirectionTo = (
  source: Entity,
  target: Entity,
): Direction | undefined => {
  const sourcePosition = getPosition(source);
  const targetPosition = getPosition(target);

  if (targetPosition < sourcePosition) return Direction.LEFT;
  if (targetPosition > sourcePosition) return Direction.RIGHT;

  return undefined;
};

export const getMovementPositionDelta = (direction: Direction) => {
  const delta = direction === Direction.LEFT ? -1 : 1;
  return delta;
};

export const getNextPosition = ({
  currentPosition,
  direction,
}: GetNextPositionParams): number | null => {
  const delta = getMovementPositionDelta(direction);
  const nextPosition = currentPosition + delta;

  if (nextPosition < 0 || nextPosition >= MAX_WORLD_SIZE) {
    return null;
  }

  return nextPosition;
};
