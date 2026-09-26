import type { Entity } from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { hasComponentsByType } from "../../../../../../../core/model/queries/components/has"
import { removeComponentsByType } from "../../../../../../../core/model/queries/components/remove"
import { getInspectedTimes } from "../../../../../../systems/inspect/inspect"
import { SpikeComponent } from "../../../../../components/combat/SpikeComponent"
import { HeadComponent } from "../../../../../components/equipment/HeadComponent"
import { PantsComponent } from "../../../../../components/equipment/PantsComponent"
import type { Manual } from "../../../../../Manual"

export const HornedHelmetEntityManual: Manual = {
  curse(_gameAction, item) {
    // Intentionally keep the current equipment slot; Pants applies on the next equip.
    removeComponentsByType(item, HeadComponent)
    upsertComponents(item, PantsComponent())
  },

  shouldBeCursed(item: Entity): boolean {
    const inspected = getInspectedTimes(item)
    return hasComponentsByType(item, SpikeComponent) && inspected >= 10
  },
}
