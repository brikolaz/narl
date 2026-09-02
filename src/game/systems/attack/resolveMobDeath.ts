import type { Entity } from "../../../core/model/Entity";
import { getEntityById } from "../../../core/model/queries/entities/get";
import { getManual } from "../../model/entities/getManual";
import { getMobById } from "../../model/queries/mobs";
import { getPosition } from "../../model/queries/position";
import { STATE } from "../../state/state";
import type { Action } from "../actions/action";
import {
  WorldActionType,
  WorldKillActionReason,
  type WorldKillActionReason as KillReason,
} from "../world/types";

export const resolveMobDeath = (
  action: Action,
  mob: Entity,
  reason: KillReason = WorldKillActionReason.ATTACK,
): void => {
  const position = getPosition(mob);
  const tile = STATE.world[position];
  if (
    getEntityById(mob.id) !== mob ||
    !tile ||
    !getMobById(tile, mob.id)
  ) {
    return;
  }

  const onDie = getManual(mob)?.onDie;
  if (onDie) {
    onDie(action, mob);
    return;
  }

  action.addPendingImmediateAction({
    type: WorldActionType.KILL,
    entityId: mob.id,
    position,
    reason,
  });
};
