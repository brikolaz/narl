import type { Entity } from "../../../core/model/Entity"
import { upsertComponents } from "../../../core/model/queries/components/add"
import {
  getComponentByType,
  getComponentsByType,
} from "../../../core/model/queries/components/get"
import type { EntityArgument } from "../../../core/model/queries/entities/normalize"
import { removeComponents } from "../../../core/model/queries/components/remove"
import { MAX_WORLD_SIZE } from "../../../core/utils/constants"
import { DirectionEnum } from "../turn/types"
import { PositionComponent } from "../../model/components/spatial/PositionComponent"

export const getPosition = (entity?: EntityArgument) => {
  return (
    getComponentByType(entity, PositionComponent)?.position ??
    PositionComponent.defaults.position
  )
}

export const setPosition = (entity: Entity, position: number) => {
  removeComponents(...getComponentsByType(entity, PositionComponent))
  upsertComponents(entity, PositionComponent({ position }))
}

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
