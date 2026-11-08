import { DefensiveStringEntity } from "../../../model/entities/items/string/variants/DefensiveString/DefensiveStringEntity"
import type { CraftInstruction } from "../types"
import { upsertComponents } from "../../../../core/model/queries/components/add"
import { hasComponentsByType } from "../../../../core/model/queries/components/has"
import { patchComponentByType } from "../../../../core/model/queries/components/patch"
import { NameComponent } from "../../../model/components/display/NameComponent"
import { PantsComponent } from "../../../model/components/equipment/PantsComponent"
import { curse } from "../../curse/curse"
import { fillContainer } from "./fillContainer"
import { ThreadComponent } from "../../../model/components/containers/ThreadComponent"

export const createLordOfTheRings: CraftInstruction = (action, items) => {
  const container = fillContainer(action, items)
  if (!container) {
    return undefined
  }

  if (hasComponentsByType(container, ThreadComponent)) {
    patchComponentByType(container, NameComponent, (component) => {
      component.name =
        container.type === DefensiveStringEntity.type
          ? "ENTITY.DEFENSIVE_LORD_OF_THE_RINGS"
          : "ENTITY.OFFENSIVE_LORD_OF_THE_RINGS"
    })
    if (!hasComponentsByType(container, PantsComponent)) {
      upsertComponents(container, PantsComponent())
    }
    curse(action, container)
  }
  return container
}
