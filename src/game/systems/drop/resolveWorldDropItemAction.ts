import { hasComponentsByType } from "../../../core/ecs/queries/components/has";
import { getEntityById } from "../../../core/ecs/queries/entities/get";
import { DroppableComponent } from "../../model/components/items/DroppableComponent";
import { getContainerItems } from "../../model/queries/containers";
import { getMobById } from "../../model/queries/mobs";
import { getTile } from "../../model/queries/tile";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import { type WorldDropItemAction } from "../world/types";
import { isDroppable } from "./drop";

export const resolveWorldDropItemAction = (
  state: GameState,
  gameAction: WorldDropItemAction,
): ActionResolution => {
  const { entityId, targetPosition, itemId } = gameAction;
  const action = new Action(gameAction);
  (() => {
    const tile = getTile(state, targetPosition);
    const source = action.assert(getMobById(tile, entityId), "No mob");
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
    tile.items.push(...itemsToDrop);

    const itemNames = itemsToDrop.map((item) => getEntityName(item)).join(", ");
    return action.success(`${sourceEntityName} dropped ${itemNames}`);
  })();

  return action.resolve(state);
};
