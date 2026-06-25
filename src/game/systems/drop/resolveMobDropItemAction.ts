import { produce } from "immer";
import {
  getComponentByType,
  hasComponentByType,
} from "../../../core/ecs/queries/component";
import {
  getEntityById,
  removeEntityById,
} from "../../../core/ecs/queries/entities";
import { NameComponent } from "../../model/components/display/NameComponent";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getMobById } from "../../model/queries/mobs";
import { getItemName } from "../../model/queries/items";
import { getTile } from "../../model/queries/tile";
import { type WorldDropItemAction } from "../world/types";
import { DroppableComponent } from "../../model/components/items/DroppableComponent";
import { getContainerItems } from "../../model/queries/containers";

export const resolveMobDropItemAction = (
  state: GameState,
  gameAction: WorldDropItemAction,
): ActionResolution => {
  const { entityId, targetPosition, itemId } = gameAction;
  const action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    const tile = getTile(draft, targetPosition);
    const source = action.assert(getMobById(tile, entityId), "No mob");
    const sourceEntityName = getComponentByType(source, NameComponent)?.name;

    const item = getEntityById(source, itemId);
    const itemsToDrop = [];
    if (!item) {
      return action.fail(`Nothing to drop`);
    }
    if (hasComponentByType(item, DroppableComponent)) {
      itemsToDrop.push(item);
    } else {
      itemsToDrop.push(
        ...getContainerItems(item).filter((item) =>
          hasComponentByType(item, DroppableComponent),
        ),
      );
    }
    if (!itemsToDrop.length) {
      return;
    }
    tile.items.push(...itemsToDrop);
    removeEntityById(source, item.id);

    const itemNames = itemsToDrop.map((item) => getItemName(item)).join(", ");
    return action.success(`${sourceEntityName} dropped ${itemNames}`);
  });

  return action.resolve(nextState);
};
