import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { WorldActionType, type WorldInitBlockAction } from "../world/types";

export const resolveWorldInitBlockAction = (
  gameAction: WorldInitBlockAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    const entity = assert(
      getEntityById(gameAction.entityId),
      "No entity to block",
    );

    action.addPendingImmediateAction({
      type: WorldActionType.BLOCK,
      entityId: entity.id,
    });
  })();

  return action.resolve();
};
