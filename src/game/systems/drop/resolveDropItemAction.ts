import { produce } from "immer";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import { WorldActionEntityType, type WorldDropItemAction } from "../actions/gameAction/types";
import type { ActionResolution } from "../actions/types";
import type { Entity } from "../../../core/ecs/Entity";
import { getBackpack } from "../inv/containers";
import { getPlayer } from "../../state/selectors/player";
import { getMobById } from "../attack/mobs";
import { getEntityById, removeEntityById } from "../../../core/ecs/queries/entities";
import { getItemName } from "../inv/items";

// TODO: split into resolvePlayerDropAction and resolveMobDropAction
export const resolveDropItemAction = (
  state: GameState,
  { entityId, entityType, targetPosition, itemId }: WorldDropItemAction,
): ActionResolution => {
  const action = new Action();
  const nextState = produce(state, (draft) => {
    let entity: Entity | undefined = undefined;
    const tile = draft.world[targetPosition];
    if (entityType === WorldActionEntityType.PLAYER) {
      entity = getBackpack(getPlayer(draft));
    } else if (entityType === WorldActionEntityType.MOB) {
      if (!entityId) {
        throw new Error("No mob id");
      }
      entity = getMobById(tile, entityId);
    }
    if (!entity) {
      throw new Error("No entity");
    }

    if (!itemId) {
      throw new Error("No item to drop");
    }
    const itemToDrop = getEntityById(entity, itemId);
    if (!itemToDrop) {
      throw new Error("No item to drop");
    }
    tile.items.push(itemToDrop);
    removeEntityById(entity, itemToDrop.id);

    return action.success(`Dropped ${getItemName(itemToDrop)}`);
  });

  return action.resolve(nextState);
};
