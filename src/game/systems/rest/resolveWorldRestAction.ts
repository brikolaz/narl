import { getComponentByType } from "../../../core/model/queries/components/get"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { HealComponent } from "../../model/components/HealComponent"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getRng } from "../rng/rng"
import { WorldActionTypeEnum, type WorldRestAction } from "../world/types"

export const resolveWorldRestAction = (
  gameAction: WorldRestAction,
): ActionResolution => {
  const action = new Action(gameAction)
  const { entityId } = gameAction

  ;(() => {
    const target = getEntityById(entityId)
    const heal = getComponentByType(target, HealComponent)

    if (!target || !heal) {
      return
    }
    const value = getRng(target).range(heal.min, heal.max)
    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_HEAL,
      entityId,
      value,
    })
    action.success()
  })()

  return action.resolve()
}
