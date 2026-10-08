import { getEntityById } from "../../../core/model/queries/entities/get"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { WorldMakePantsAction } from "../world/types"
import { upsertComponents } from "../../../core/model/queries/components/add"
import { removeComponentsByType } from "../../../core/model/queries/components/remove"
import { HeadComponent } from "../../model/components/equipment/HeadComponent"
import { PantsComponent } from "../../model/components/equipment/PantsComponent"
export const resolveWorldMakePantsAction = (
  gameAction: WorldMakePantsAction,
): ActionResolution => {
  const action = new Action(gameAction)
  ;(() => {
    const entity = getEntityById(gameAction.entityId)
    if (!entity) return
    // Intentionally keep the current equipment slot; Pants applies on the next equip.
    removeComponentsByType(entity, HeadComponent)
    upsertComponents(entity, PantsComponent())
  })()
  return action.resolve()
}
