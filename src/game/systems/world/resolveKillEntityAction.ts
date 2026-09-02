import { getBackpack } from "../../model/queries/containers";
import { assert } from "../../../utils/assert";
import { getExp } from "../../model/queries/exp";
import { getMobById } from "../../model/queries/mobs";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import {
  WorldActionType,
  WorldKillActionReason,
  type WorldKillAction,
} from "./types";

export const resolveKillEntityAction = (
  gameAction: WorldKillAction,
): ActionResolution => {
  const action: Action = new Action(gameAction);
  const {
    entityId,
    position,
    reason
  } = gameAction;
  (() => {
    const tile = getTile(position);
    const mob = getMobById(tile, entityId);
    if (!mob) {
      return;
    }
    const backpack = assert(getBackpack(mob), "Mob has no backpack");
    action.success(
      reason === WorldKillActionReason.ATTACK
        ? `${getEntityName(mob)} died`
        : undefined,
    );
    const exp = getExp(mob);
    action.addPendingImmediateAction({
      type: WorldActionType.GAIN_EXP,
      exp,
    });
    action.addPendingImmediateAction({
      type: WorldActionType.DROP_ITEM,
      targetPosition: position,
      entityId,
      itemId: backpack.id,
    });
    action.addPendingImmediateAction({
      type: WorldActionType.REMOVE_ENTITY,
      entityId,
      position,
    });
    return;
  })();

  return action.resolve();
};
