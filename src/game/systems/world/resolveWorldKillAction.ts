import { getEntityName } from "../inspect/getEntityName"
import { getBackpack } from "../containers/containers"
import { assert } from "../../../utils/assert"
import { getExp } from "../exp/exp"
import { getPlayer } from "../player/player"
import { getMobById } from "../mobs/mobs"
import { getTile } from "./tile"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import {
  WorldActionTypeEnum,
  WorldKillActionReasonEnum,
  type WorldKillAction,
} from "./types"

export const resolveWorldKillAction = (
  gameAction: WorldKillAction,
): ActionResolution => {
  const action: Action = new Action(gameAction)
  const { entityId, position, reason } = gameAction
  ;(() => {
    const tile = getTile(position)
    const mob = getMobById(tile, entityId)
    if (!mob) {
      return
    }
    const backpack = assert(getBackpack(mob), "Mob has no backpack")
    action.success(
      reason === WorldKillActionReasonEnum.ATTACK ? "ENTITY.DIED" : undefined,
      getEntityName(mob),
    )
    const exp = getExp(mob)
    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_GAIN_EXP,
      targetEntityId: getPlayer().id,
      exp,
    })
    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_DROP_ITEM,
      targetPosition: position,
      entityId,
      itemId: backpack.id,
    })
    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_REMOVE_ENTITY,
      entityId,
      position,
    })
    return
  })()

  return action.resolve()
}
