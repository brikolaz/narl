import { produce } from "immer";
import { addEntity, removeEntityById } from "../../../core/ecs";
import { getPlayer, type GameState } from "../../state";
import { getBackpack, isContainer, isContainerFull } from "../inv";
import { getInvItemAt } from "../inv/inv";
import { Action } from "../log";
import type { ActionResolution, InvSlot } from "../turn";

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
    removeEntityById(backpack, fromItem.id);
    addEntity(toItem, fromItem);

    action.fulfill(
      `Moved item from inv slot ${fromSlot} to container at slot ${toSlot}`,
    );
  });

  return action.resolve(nextState);
};
