import {
  getBackpack,
  getContainerItemAt,
  getMaxNestDepth,
  getNestDepth,
  isContainer,
  isContainerFull,
} from "../../model/queries/containers";
import { assert } from "../../../utils/assert";
import { getPlayer } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  addItemToContainer
} from "../containers/containers";
import { getEntityName } from "../inspect/getEntityName";
import type { PlayerMoveItemAction } from "../player/types";

// TODO: add swap (new resolver)
export const resolveMoveItemAction = (
  gameAction: PlayerMoveItemAction,
): ActionResolution => {
  const { fromSlot, toSlot } = gameAction;
  const action: Action = new Action(gameAction);
  (() => {
    const player = getPlayer();
    const backpack = assert(getBackpack(player), "No backpack");
    const fromItem = getContainerItemAt(backpack, fromSlot);
    const toItem = getContainerItemAt(backpack, toSlot);

    if (!fromItem || !toItem) {
      return action.fail("Invalid item selection");
    }

    if (fromItem.id === toItem.id) {
      return action.fail("Source and target are the same item");
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

    addItemToContainer(toItem, fromItem);

    action.success(
      `Moved ${getEntityName(fromItem)} from inv slot ${fromSlot} to ${getEntityName(toItem)} at slot ${toSlot}`,
    );
  })();

  return action.resolve();
};
