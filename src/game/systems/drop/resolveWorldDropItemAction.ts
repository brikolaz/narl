import { produce } from "immer";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getMobById } from "../../model/queries/mobs";
import { getTile } from "../../model/queries/tile";
import { type WorldDropItemAction } from "../world/types";
import { DroppableComponent } from "../../model/components/items/DroppableComponent";
import { getContainerItems } from "../../model/queries/containers";
import { getEntityName } from "../inspect/getEntityName";
import { getEntityById } from "../../../core/ecs/queries/entities/get";
import { hasComponentsByType } from "../../../core/ecs/queries/components/has";

export const resolveWorldDropItemAction = (
  state: GameState,
  gameAction: WorldDropItemAction,
): ActionResolution => {
  const { entityId, targetPosition, itemId } = gameAction;
  const action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    const tile = getTile(draft, targetPosition);
    const source = action.assert(getMobById(tile, entityId), "No mob");
    const sourceEntityName = getEntityName(source);

    const item = getEntityById(itemId);
    const itemsToDrop = [];
    if (!item) {
      return action.fail(`Nothing to drop`);
    }
    if (hasComponentsByType(item, DroppableComponent)) {
      itemsToDrop.push(item);
    } else {
      itemsToDrop.push(
        ...getContainerItems(item).filter((item) =>
          hasComponentsByType(item, DroppableComponent),
        ),
      );
    }
    if (!itemsToDrop.length) {
      return;
    }
    tile.items.push(...itemsToDrop);

    const itemNames = itemsToDrop.map((item) => getEntityName(item)).join(", ");
    return action.success(`${sourceEntityName} dropped ${itemNames}`);
  });

  return action.resolve(nextState);
};
