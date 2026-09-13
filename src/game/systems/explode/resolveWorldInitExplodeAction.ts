import { getEntityById } from "../../../core/model/queries/entities/get"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import {
  WorldActionTypeEnum,
  type WorldInitExplodeAction,
} from "../world/types"
import { canExplode } from "./explode"

export const resolveWorldInitExplodeAction = (
  gameAction: WorldInitExplodeAction,
): ActionResolution => {
  const action = new Action(gameAction)

  ;(() => {
    const target = getEntityById(gameAction.entityId)
    if (!target || !canExplode(target)) {
      return
    }

    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_EXPLODE,
      entityId: target.id,
    })
  })()

  return action.resolve()
}
