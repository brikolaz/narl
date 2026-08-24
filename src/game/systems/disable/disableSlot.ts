import type { Entity } from "../../../core/model/Entity";
import type { Action } from "../actions/action";
import { WorldActionType } from "../world/types";

export const disableSlot = (action: Action, item: Entity) => {
  action.addPendingImmediateAction({
    type: WorldActionType.DISABLE,
    entityId: item.id,
  });
};
