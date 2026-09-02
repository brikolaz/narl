import { removeComponentsByType } from "../../../core/model/queries/components/remove";
import { getEntityById } from "../../../core/model/queries/entities/get";
import { ExplodeComponent } from "../../model/components/ExplodeComponent";
import { ExplodeRangeComponent } from "../../model/components/ExplodeRangeComponent";
import { getMobById } from "../../model/queries/mobs";
import { getPosition } from "../../model/queries/position";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  WorldActionType,
  WorldKillActionReason,
  type WorldCleanupExplodeAction,
} from "../world/types";

export const resolveWorldCleanupExplodeAction = (
  gameAction: WorldCleanupExplodeAction,
): ActionResolution => {
  const action = new Action(gameAction);
  const { entityId } = gameAction;

  (() => {
    const target = getEntityById(entityId);
    if (!target) {
      return;
    }

    removeComponentsByType(target, ExplodeComponent);
    removeComponentsByType(target, ExplodeRangeComponent);

    const position = getPosition(target);
    const tile = getTile(position);
    const mob = getMobById(tile, target.id);

    if (!mob) {
      return;
    }

    action.addPendingImmediateAction({
      type: WorldActionType.KILL,
      entityId: mob.id,
      position,
      reason: WorldKillActionReason.EXPLODE,
    });
  })();

  return action.resolve();
};
