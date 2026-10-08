import { getEntityById } from "../../../core/model/queries/entities/get"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { WorldUpdateDmgAction } from "../world/types"
import { upsertComponents } from "../../../core/model/queries/components/add"
import { DmgComponent } from "../../model/components/combat/DmgComponent"
import { DmgMulComponent } from "../../model/components/combat/DmgMulComponent"
export const resolveWorldUpdateDmgAction = (
  gameAction: WorldUpdateDmgAction,
): ActionResolution => {
  const action = new Action(gameAction)
  ;(() => {
    const entity = getEntityById(gameAction.entityId)
    if (!entity) return
    upsertComponents(
      entity,
      DmgMulComponent({ dmgMul: gameAction.dmgMul }),
      DmgComponent({ min: gameAction.min, max: gameAction.max }),
    )
  })()
  return action.resolve()
}
