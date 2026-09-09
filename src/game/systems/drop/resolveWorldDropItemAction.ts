import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { getContainerItems } from "../containers/containers";
import { getMobById } from "../mobs/mobs";
import { getTile } from "../world/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import { type WorldDropItemAction } from "../world/types";
import { dropItem, isDroppable } from "./drop";

export const resolveWorldDropItemAction = (
  gameAction: WorldDropItemAction,
): ActionResolution => {
  const { entityId, targetPosition, itemId } = gameAction;
  const action = new Action(gameAction);
  (() => {
    const tile = getTile(targetPosition);
    const source = assert(getMobById(tile, entityId), "No mob");
    const sourceEntityName = getEntityName(source);

    const item = getEntityById(itemId);
    const itemsToDrop = [];
    if (!item) {
      return action.fail(`Nothing to drop`);
    }
    if (isDroppable(item)) {
      itemsToDrop.push(item);
    } else {
      itemsToDrop.push(
        ...getContainerItems(item).filter((item) => isDroppable(item)),
      );
    }
    if (!itemsToDrop.length) {
      return;
    }

    itemsToDrop.forEach((item) => dropItem(item, targetPosition));

    const itemNames = itemsToDrop.map((item) => getEntityName(item)).join(", ");
    return action.success(`${sourceEntityName} dropped ${itemNames}`);
  })();

  return action.resolve();
};
