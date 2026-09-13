import type { Entity } from "../../../core/model/Entity"
import { upsertComponents } from "../../../core/model/queries/components/add"
import {
  getComponentByType,
  getComponentsByType,
} from "../../../core/model/queries/components/get"
import type { EntityArgument } from "../../../core/model/queries/entities/normalize"
import { removeComponents } from "../../../core/model/queries/components/remove"
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
