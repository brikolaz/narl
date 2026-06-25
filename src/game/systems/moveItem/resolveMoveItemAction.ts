import { produce } from "immer";
import { getPlayerEntity } from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  addItemToContainer,
  clearContainerItemById,
} from "../inv/containers";
import {
  getBackpack,
  getContainerItemAt,
  getMaxNestDepth,
  getNestDepth,
  isContainer,
  isContainerFull,
} from "../../model/queries/containers";
import { getItemName } from "../../model/queries/items";
import type { PlayerMoveItemAction } from "../player/types";

// TODO: add swap (new resolver)
export const resolveMoveItemAction = (
  state: GameState,
  gameAction: PlayerMoveItemAction,
): ActionResolution => {
  const { fromSlot, toSlot } = gameAction;
  const action: Action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    const player = getPlayerEntity(draft);
    const backpack = action.assert(getBackpack(player), "No backpack");
    const fromItem = getContainerItemAt(backpack, fromSlot);
    const toItem = getContainerItemAt(backpack, toSlot);

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

    clearContainerItemById(backpack, fromItem.id);
    addItemToContainer(toItem, fromItem);

    action.success(
      `Moved ${getItemName(fromItem)} from inv slot ${fromSlot} to ${getItemName(toItem)} at slot ${toSlot}`,
    );
  });

  return action.resolve(nextState);
};
