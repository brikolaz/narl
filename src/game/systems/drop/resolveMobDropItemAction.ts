import { produce } from "immer";
import { getComponentByType } from "../../../core/ecs/queries/component";
import {
  getEntityById,
  removeEntityById,
} from "../../../core/ecs/queries/entities";
import { NameComponent } from "../../model/components/NameComponent";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getMobById } from "../attack/mobs";
import { getItemName } from "../inv/items";
import { getTile } from "../world/getTile";
import {
  type WorldDropItemAction
} from "../world/types";

export const resolveMobDropItemAction = (
  state: GameState,
  gameAction: WorldDropItemAction,
): ActionResolution => {
  const { entityId, targetPosition, itemId } = gameAction;
  const action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    const tile = getTile(draft, targetPosition);
    const source = getMobById(tile, entityId);
    const sourceEntityName = getComponentByType(source, NameComponent)?.name;
    if (!source) {
      throw new Error("No mob");
    }

    const itemToDrop = getEntityById(source, itemId);
    if (!itemToDrop) {
      return action.fail(`Nothing to drop`);
    }
    tile.items.push(itemToDrop);
    removeEntityById(source, itemToDrop.id);

    return action.success(
      `${sourceEntityName} dropped ${getItemName(itemToDrop)}`,
    );
  });

  return action.resolve(nextState);
};
