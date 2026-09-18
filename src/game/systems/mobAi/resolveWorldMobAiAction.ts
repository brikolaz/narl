import { getEntityById } from "../../../core/model/queries/entities/get"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { WorldMobAiAction } from "../world/types"
import { attack } from "./commands/attack"
import { friendlyAttack } from "./commands/friendlyAttack"
import { move } from "./commands/move"

export const resolveWorldMobAiAction = (
  gameAction: WorldMobAiAction,
): ActionResolution => {
  const { mobId } = gameAction
  const action = new Action(gameAction)

  ;(() => {
    const mob = getEntityById(mobId)
    if (!mob) {
      return
    }
    const pendingAction = attack(mob) ?? friendlyAttack(mob) ?? move(mob)
    if (pendingAction) {
      action.addPendingImmediateAction(pendingAction)
    }
  })()

  return action.resolve()
}
