import type { Entity } from "../../../core/model/Entity"
import { upsertComponents } from "../../../core/model/queries/components/add"

import {
  getComponentByType,
  getComponentsByType,
} from "../../../core/model/queries/components/get"
import { InspectDescComponent } from "../../model/components/interaction/InspectDescComponent"
import { InspectedComponent } from "../../model/components/interaction/InspectedComponent"

export const getInspectedTimes = (item: Entity) => {
  return (
    getComponentByType(item, InspectedComponent)?.times ??
    InspectedComponent.defaults.times
  )
}

export const getInspectDesc = (entity: Entity) => {
  const inspectedTimes = getInspectedTimes(entity)
  const inspectDesc = (getComponentsByType(entity, InspectDescComponent) ?? [])
    .filter(({ times: requiredTimes }) => inspectedTimes >= requiredTimes)
    .sort((a, b) => a.times - b.times)

  return inspectDesc.at(-1)?.text ?? ""
}

export const increaseInspected = (entity: Entity) => {
  const inspected =
    getComponentByType(entity, InspectedComponent) ?? InspectedComponent()
  inspected.times = inspected.times + 1
  upsertComponents(entity, inspected)
}
