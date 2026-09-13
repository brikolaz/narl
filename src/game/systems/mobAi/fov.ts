import type { Entity } from "../../../core/model/Entity"
import { getComponentByType } from "../../../core/model/queries/components/get"
import { FovComponent } from "../../model/components/ai/FovComponent"
import { getPosition } from "../position/position"

const getFovRange = (entity: Entity) => {
  return (
    getComponentByType(entity, FovComponent)?.range ??
    FovComponent.defaults.range
  )
}
export const isInFov = (source: Entity, target: Entity) => {
  const fov = getFovRange(source)
  const targetPosition = getPosition(target)
  const sourcePosition = getPosition(source)

  return Math.abs(targetPosition - sourcePosition) <= fov
}
