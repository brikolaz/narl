import type { Entity } from "../../../../core/ecs/Entity";
import { getManual } from "../../../model/entities/getManual";
import { isCursed } from "../../../model/queries/curse";
import type { Action } from "../../actions/action";
import { EffectType } from "../effects";

export const curse = (item: Entity, action: Action) => {
  const manual = getManual(item);

  if (!isCursed(item) && manual?.shouldBeCursed?.(item)) {
    action.addPendingEffect({
      type: EffectType.CURSE,
      entityId: item.id,
    });
  }
};
