import {
  getBackpack,
  getContainerItemAt,
  isContainerFull,
} from "../../model/queries/containers";
import { assert } from "../../../utils/assert";
import { isRemovable } from "../../model/queries/items";
import { getPlayerEntity, getPlayerPosition } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import {
  addItemToEntityBackpack,
  clearContainerItemAt,
} from "../containers/containers";
import {
  PlayerActionType,
  PlayerDropItemActionReason,
  type PlayerUnequipItemAction,
} from "../player/types";
import { getEqSlotByPosition } from "../../model/queries/eq";

export const resolveUnequipAction = (
  gameAction: PlayerUnequipItemAction,
): ActionResolution => {
  const { eqSlot: eqSlotIndex } = gameAction;

  const action: Action = new Action(gameAction);
  (() => {
    const player = getPlayerEntity();
    const backpack = assert(
      getBackpack(player),
      "Player has no backpack",
    );
    const isFull = isContainerFull(backpack);

    const slot = assert(
      getEqSlotByPosition(player, eqSlotIndex),
      "No EQ slot",
    );
    const slotName = getEntityName(slot);
    const item = getContainerItemAt(slot, 1);
    if (!item) {
      return action.fail(`No item at ${slotName} EQ slot`);
    }

    if (!isRemovable(item)) {
      return action.fail(`Can't be removed`);
    }

    if (isFull) {
      return action.addPendingImmediateAction({
        type: PlayerActionType.DROP_ITEM,
        targetPosition: getPlayerPosition(),
        eqSlot: eqSlotIndex,
        invSlot: undefined,
        reason: PlayerDropItemActionReason.BACKPACK_FULL,
      });
    }

    addItemToEntityBackpack(player, item);
    clearContainerItemAt(slot, 1);
    action.success(
      `Unequipped ${getEntityName(item)} from ${slotName} EQ slot`,
    );
  })();

  return action.resolve();
};
