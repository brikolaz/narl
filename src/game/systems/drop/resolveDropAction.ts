import { produce } from "immer";
import { getPlayer } from "../../state";
import type { GameState } from "../../state/state";
import { WorldActionEntityType, type ActionResolution } from "../turn";

import { Entity, getEntityById } from "../../../core/ecs";
import { getMobById } from "../combat";
import { Action } from "../log";

export const resolveDropAction = (
  state: GameState,
  targetPosition: number,
  entityType: WorldActionEntityType,
  entityId: string | undefined,
  itemId: string,
): ActionResolution => {
  debugger;
  const action = new Action();
  const nextState = produce(state, (draft) => {
    let entity: Entity | undefined = undefined;
    const tile = draft.world[targetPosition];
    if (entityType === WorldActionEntityType.PLAYER) {
      entity = getPlayer(draft);
    } else if (entityType === WorldActionEntityType.MOB) {
      if (!entityId) {
        throw new Error("No mob id");
      }
      entity = getMobById(tile, entityId);
    }
    if (!entity) {
      throw new Error("No entity");
    }

    const itemToDrop = getEntityById(entity, itemId);
    if (!itemToDrop) {
      throw new Error("No item to drop");
    }
    tile.items.push(itemToDrop);

    return action.fulfill(`Dropped an item.`);
  });

  return action.resolve(nextState);
};
