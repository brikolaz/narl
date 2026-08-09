import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { getMob, hasMobs } from "../../model/queries/mobs";
import { getPosition } from "../../model/queries/position";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { WorldActionType, type WorldMoveAction } from "../world/types";
import { move } from "./move";
import { getNextPosition } from "./position";

export const resolveWorldMoveAction = (
  gameAction: WorldMoveAction,
): ActionResolution => {
  const { entityId, direction } = gameAction;
  const action = new Action(gameAction);

  (() => {
    const entity = assert(getEntityById(entityId), "No entity to move");
    const nextPosition = getNextPosition({
      currentPosition: getPosition(entity),
      direction,
    });
    if (nextPosition === null) {
      return;
    }
    const nextTile = getTile(nextPosition);
    if (hasMobs(nextTile)) {
      return action.addPendingImmediateAction({
        type: WorldActionType.ATTACK,
        sourceId: entityId,
        targetId: getMob(nextTile).id,
      });
    }
    move(entity, nextPosition);
  })();

  return action.resolve();
};
