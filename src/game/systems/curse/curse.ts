import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import type { EntityArgument } from "../../../core/model/queries/entities/normalize";
import { CursedComponent } from "../../model/components/state/CursedComponent";
import { getManual } from "../../model/entities/getManual";
import type { Action } from "../actions/action";
import { WorldActionType } from "../world/types";

export const isCursed = (entity: EntityArgument) => {
  return hasComponentsByType(entity, CursedComponent);
};

export const curse = (action: Action, item: Entity) => {
  const manual = getManual(item);

  if (!isCursed(item) && manual?.shouldBeCursed?.(item)) {
    action.addPendingImmediateAction({
      type: WorldActionType.CURSE,
      entityId: item.id,
    });
  }
};
