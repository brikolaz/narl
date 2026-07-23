import type { Entity } from "../../../../core/ecs/Entity";
import type { Action } from "../../actions/action";
import { EffectType } from "../types";

export const disableSlot = (action: Action, item: Entity) => {
  action.addPendingEffects({
    type: EffectType.DISABLE_SLOT,
    entityId: item.id,
  });
};
