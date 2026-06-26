import type { Entity } from "../../../core/ecs/Entity";
import {
  getItemFactory,
  type ItemClass,
} from "../../model/entities/items/getItemFactory";
import { isCursed } from "../../model/queries/curse";
import type { Action } from "../actions/action";
import { getEntityName } from "../inspect/getEntityName";

export const curse = (item: Entity, action: Action) => {
  const factory = getItemFactory(item.constructor as ItemClass);

  if (!isCursed(item) && factory.shouldBeCursed?.(item)) {
    const msg = `${getEntityName(item)} got cursed`;
    const gotCursed = !!factory.curse?.(item);
    if (gotCursed) {
      action.info(msg);
    }
    return gotCursed;
  }
};
