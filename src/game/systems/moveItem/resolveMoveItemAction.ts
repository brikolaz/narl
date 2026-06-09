import { produce } from "immer";
import { getPlayerEntity } from "../../state/selectors/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  addItemToContainer,
  clearContainerItemById,
  getBackpack,
  getMaxNestDepth,
  getNestDepth,
  isContainer,
  isContainerFull,
} from "../inv/containers";
import { getInvItemAt } from "../inv/inv";
import { getItemName } from "../inv/items";
import type { PlayerMoveItemAction } from "../player/types";

// TODO: add swap (new resolver)
export const resolveMoveItemAction = (
  state: GameState,
  gameAction: PlayerMoveItemAction,
): ActionResolution => {
  const { fromSlot, toSlot } = gameAction;
  const action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    const player = getPlayerEntity(draft);
    const backpack = getBackpack(player);
    if (!backpack) {
      throw new Error("No backpack");
    }
    const fromItem = getInvItemAt(backpack, fromSlot);
    const toItem = getInvItemAt(backpack, toSlot);

    if (!fromItem || !toItem) {
      return action.fail("Invalid item selection");
    }

    if (!isContainer(toItem)) {
      return action.fail("Target item is not a container");
    }

    if (isContainerFull(toItem)) {
      return action.fail("Target container is full");
    }

    if (isContainer(fromItem)) {
      const fromItemNestDepth = getNestDepth(fromItem);
      const toItemMaxNextDepth = getMaxNestDepth(toItem);
      if (fromItemNestDepth + 1 > toItemMaxNextDepth) {
        return action.fail(`Max nest depth (${toItemMaxNextDepth}) reached`);
      }
    }

    clearContainerItemById(backpack, fromItem.id)
    addItemToContainer(toItem, fromItem);

    action.success(
      `Moved ${getItemName(fromItem)} from inv slot ${fromSlot} to ${getItemName(toItem)} at slot ${toSlot}`,
    );
  });

  return action.resolve(nextState);
};
