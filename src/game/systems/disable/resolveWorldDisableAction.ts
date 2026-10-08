import { upsertComponents } from "../../../core/model/queries/components/add"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { DisabledComponent } from "../../model/components/state/DisabledComponent"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { WorldDisableAction } from "../world/types"

export const resolveWorldDisableAction = (
  gameAction: WorldDisableAction,
): ActionResolution => {
  const { entityId } = gameAction
  const action = new Action(gameAction)

  ;(() => {
    const entity = getEntityById(entityId)
    if (!entity) return
    upsertComponents(entity, DisabledComponent())
  })()

  return action.resolve()
}
