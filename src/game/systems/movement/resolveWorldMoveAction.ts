import type { Entity } from "../../../core/model/Entity";
import { patchComponentByType } from "../../../core/model/queries/components/patch";
import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { removeById } from "../../../utils/removeById";
import { PositionComponent } from "../../model/components/PositionComponent";
import { getMob, hasMobs } from "../../model/queries/mobs";
import { getPosition } from "../../model/queries/position";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { WorldActionType, type WorldMoveAction } from "../world/types";
import { getNextPosition } from "./position";

// TODO: handle other entity kind (items etc.) movement if needed
const move = (entity: Entity, nextPosition: number) => {
  const tile = getTile(getPosition(entity));
  removeById(tile.mobs, entity.id);
  const nextTile = getTile(nextPosition);
  nextTile.mobs.push(entity);
  patchComponentByType(entity, PositionComponent, (component) => {
    component.position = nextPosition;
  });
};

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
