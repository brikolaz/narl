import type { Entity } from "../../../core/ecs/Entity";
import { getManual } from "../../model/entities/getManual";
import { isCursed } from "../../model/queries/curse";
import type { Action } from "../actions/action";
import { WorldActionType } from "../world/types";

export const curse = (action: Action, item: Entity) => {
  const manual = getManual(item);

  if (!isCursed(item) && manual?.shouldBeCursed?.(item)) {
    action.addPendingAction({
      type: WorldActionType.CURSE,
      entityId: item.id,
    });
  }
};
