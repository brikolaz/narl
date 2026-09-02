import { getEntityById } from "../../../core/model/queries/entities/get";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { WorldActionType, type WorldInitExplodeAction } from "../world/types";
import { canExplode } from "./explode";

export const resolveWorldInitExplodeAction = (
  gameAction: WorldInitExplodeAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    const target = getEntityById(gameAction.entityId);
    if (
      !target ||
      !canExplode(target)
    ) {
      return;
    }

    action.addPendingImmediateAction(
      {
        type: WorldActionType.EXPLODE,
        entityId: target.id,
      },
    );
  })();

  return action.resolve();
};
