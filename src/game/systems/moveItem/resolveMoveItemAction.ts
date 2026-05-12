import { produce } from "immer";
import { addEntity, Entity, removeEntityById } from "../../../core/ecs";
import { getPlayer, type GameState } from "../../state";
import { getBackpack, isContainer, isContainerFull } from "../inv";
import { getInvItemAt } from "../inv/inv";
import { Action } from "../log";
import type { ActionResolution, InvSlot } from "../turn";
import { MAX_CURSED_CONTAINER_DEPTH } from "../../../utils";

const getNestDepth = (entity: Entity): number => {
  if (!isContainer(entity)) {
    return 0;
  }

  const nestedContainers = entity.entities.filter(isContainer);

  if (!nestedContainers.length) {
    return 1;
  }

  return 1 + Math.max(...nestedContainers.map(getNestDepth));
};

// TODO: add swap (new resolver)
export const resolveMoveItemAction = (
  state: GameState,
  fromSlot: InvSlot,
  toSlot: InvSlot,
): ActionResolution => {
  const action = new Action();
  const nextState = produce(state, (draft) => {
    const player = getPlayer(draft);
    const backpack = getBackpack(player);
    if (!backpack) {
      throw new Error("No backpack");
    }
    const fromItem = getInvItemAt(backpack, fromSlot);
    const toItem = getInvItemAt(backpack, toSlot);

    if (!fromItem || !toItem) {
      return action.reject("Invalid item selection");
    }

    if (!isContainer(toItem)) {
      return action.reject("Target item is not a container");
    }

    if (isContainerFull(toItem)) {
      return action.reject("Target container is full");
    }

    if (isContainer(fromItem)) {
      const fromItemNestDepth = getNestDepth(fromItem);

      if (fromItemNestDepth + 1 > MAX_CURSED_CONTAINER_DEPTH) {
        return action.reject(
          `Max nest depth (${MAX_CURSED_CONTAINER_DEPTH}) reached`,
        );
      }
    }

    removeEntityById(backpack, fromItem.id);
    addEntity(toItem, fromItem);

    action.fulfill(
      `Moved item from inv slot ${fromSlot} to container at slot ${toSlot}`,
    );
  });

  return action.resolve(nextState);
};
