import { produce } from "immer";
import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/component";
import {
  getEntityById,
  removeEntityById,
} from "../../../core/ecs/queries/entities";
import { NameComponent } from "../../model/components/NameComponent";
import { getPlayer } from "../../state/selectors/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import {
  WorldActionEntityType,
  type WorldDropItemAction,
} from "../world/types";
import type { ActionResolution } from "../actions/types";
import { getMobById } from "../attack/mobs";
import { getBackpack } from "../inv/containers";
import { getItemName } from "../inv/items";

// TODO: split into resolvePlayerDropAction and resolveMobDropAction
export const resolveDropItemAction = (
  state: GameState,
  gameAction: WorldDropItemAction,
): ActionResolution => {
  const { entityId, entityType, targetPosition, itemId } = gameAction;
  const action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    let source: Entity | undefined = undefined;
    let sourceEntityName: string | undefined;
    const tile = draft.world[targetPosition];
    if (entityType === WorldActionEntityType.PLAYER) {
      source = getBackpack(getPlayer(draft));
    } else if (entityType === WorldActionEntityType.MOB) {
      if (!entityId) {
        throw new Error("No mob id");
      }
      source = getMobById(tile, entityId);
      sourceEntityName = getComponentByType(source, NameComponent)?.name;
    }
    if (!source) {
      throw new Error("No entity");
    }

    if (!itemId) {
      return action.fail(`Nothing to drop`);
    }
    const itemToDrop = getEntityById(source, itemId);
    if (!itemToDrop) {
      return action.fail(`Nothing to drop`);
    }
    tile.items.push(itemToDrop);
    removeEntityById(source, itemToDrop.id);

    if (sourceEntityName) {
      return action.success(
        `${sourceEntityName} dropped ${getItemName(itemToDrop)}`,
      );
    }
    return action.success(`Dropped ${getItemName(itemToDrop)}`);
  });

  return action.resolve(nextState);
};
