import { getEntityLogProjection } from "../log/getEntityLogProjection"
import { getComponentsByType } from "../../../core/model/queries/components/get"
import { removeComponents } from "../../../core/model/queries/components/remove"
import { getComponentRegistryRecord } from "../../../core/model/registry/componentRegistry"
import { BleedComponent } from "../../model/components/combat/BleedComponent"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { WorldCleanupBleedAction } from "../world/types"

export const resolveWorldCleanupBleedAction = (
  gameAction: WorldCleanupBleedAction,
): ActionResolution => {
  const { bleedId } = gameAction
  const action = new Action(gameAction)

  ;(() => {
    const bleedRecord = getComponentRegistryRecord(bleedId)
    if (!bleedRecord) {
      return
    }

    removeComponents(bleedId)
    const parent = bleedRecord.parent

    if (getComponentsByType(parent, BleedComponent).length > 0) {
      action.info("BLEED.LESS", getEntityLogProjection(parent))
    } else {
      action.info("BLEED.STOPPED", getEntityLogProjection(bleedRecord.parent))
    }
  })()

  return action.resolve()
}
