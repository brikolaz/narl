import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { getManual } from "../../model/entities/getManual";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { WorldDisableAction } from "../world/types";

export const resolveDisableAction = (
  gameAction: WorldDisableAction,
): ActionResolution => {
  const { entityId } = gameAction;
  const action = new Action(gameAction);

  (() => {
    const entity = assert(getEntityById(entityId), "No entity to disable");
    const manual = getManual(entity);
    manual?.disable?.(action, entity);
  })();

  return action.resolve();
};
