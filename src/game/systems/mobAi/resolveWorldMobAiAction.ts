import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { getEntityById } from "../../../core/model/queries/entities/get";
import { isAdjacent } from "../../../utils/adjacent";
import { MovableComponent } from "../../model/components/MovableComponent";
import { UnawareComponent } from "../../model/components/UnawareComponent";
import { getPlayerEntity, getPlayerPosition } from "../../model/queries/player";
import { getPosition } from "../../model/queries/position";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { isHostile } from "../attack/hostililty";
import { getDirectionTo } from "../movement/position";
import { WorldActionType, type WorldMobAiAction } from "../world/types";
import { inFov } from "./fov";
import { hasPath } from "./path";

export const resolveWorldMobAiAction = (
  gameAction: WorldMobAiAction,
): ActionResolution => {
  const { mobId } = gameAction;
  const action = new Action(gameAction);

  (() => {
    const mob = action.assert(getEntityById(mobId), "No mob");
    if (isHostile(mob)) {
      if (isAdjacent(getPlayerPosition(), getPosition(mob))) {
        action.addPendingImmediateAction({
          type: WorldActionType.ATTACK,
          sourceId: mobId,
          targetId: getPlayerEntity().id,
        });
      } else if (
        hasComponentsByType(mob, MovableComponent) &&
        hasPath(mob, getPlayerEntity()) &&
        !hasComponentsByType(mob, UnawareComponent) &&
        inFov(mob, getPlayerEntity())
      ) {
        const direction = action.assert(
          getDirectionTo(mob, getPlayerEntity()),
          "Invalid direction",
        );
        action.addPendingImmediateAction({
          type: WorldActionType.MOVE,
          entityId: mob.id,
          direction,
        });
      }
    }
  })();

  return action.resolve();
};
