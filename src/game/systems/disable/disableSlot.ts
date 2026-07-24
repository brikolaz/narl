import type { Entity } from "../../../core/ecs/Entity";
import type { Action } from "../actions/action";
import { WorldActionType } from "../world/types";

export const disableSlot = (action: Action, item: Entity) => {
  action.addPendingAction({
    type: WorldActionType.DISABLE,
    entityId: item.id,
  });
};
