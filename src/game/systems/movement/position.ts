// TODO: move outside movement system
import type { Entity } from "../../../core/model/Entity"
import { MAX_WORLD_SIZE } from "../../../utils/constants"
import { getPosition } from "../position/position"
import { DirectionEnum } from "../turn/types"

type GetNextPositionParams = {
  currentPosition: number
  direction: DirectionEnum
}

export const getDirection = (
  source: Entity,
  target: Entity,
): DirectionEnum | undefined => {
  const sourcePosition = getPosition(source)
  const targetPosition = getPosition(target)

  if (targetPosition < sourcePosition) return DirectionEnum.LEFT
  if (targetPosition > sourcePosition) return DirectionEnum.RIGHT

  return undefined
}

const getPositionDelta = (direction: DirectionEnum) => {
  const delta = direction === DirectionEnum.LEFT ? -1 : 1
  return delta
}

export const getNextPosition = ({
  currentPosition,
  direction,
}: GetNextPositionParams): number | null => {
  const delta = getPositionDelta(direction)
  const nextPosition = currentPosition + delta

  if (nextPosition < 0 || nextPosition >= MAX_WORLD_SIZE) {
    return null
  }

  return nextPosition
}
