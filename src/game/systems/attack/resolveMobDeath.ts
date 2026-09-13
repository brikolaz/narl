import type { Entity } from "../../../core/model/Entity"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { getManual } from "../../model/entities/getManual"
import { getMobById } from "../mobs/mobs"
import { getPosition } from "../position/position"
import { STATE } from "../../state/state"
import type { Action } from "../actions/action"
import { WorldActionTypeEnum, WorldKillActionReasonEnum } from "../world/types"

export const resolveMobDeath = (
  action: Action,
  mob: Entity,
  reason: WorldKillActionReasonEnum = WorldKillActionReasonEnum.ATTACK,
): void => {
  const position = getPosition(mob)
  const tile = STATE.world[position]
  if (getEntityById(mob.id) !== mob || !tile || !getMobById(tile, mob.id)) {
    return
  }

  const onDie = getManual(mob)?.onDie
  if (onDie) {
    onDie(action, mob)
    return
  }

  action.addPendingImmediateAction({
    type: WorldActionTypeEnum.WORLD_KILL,
    entityId: mob.id,
    position,
    reason,
  })
}
