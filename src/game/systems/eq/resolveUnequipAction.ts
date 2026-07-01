import { produce } from "immer";
import {
  getBackpack,
  getContainerItemAt,
  isContainerFull,
} from "../../model/queries/containers";
import { getEqSlot } from "../../model/queries/eq";
import { isRemovable } from "../../model/queries/items";
import { getPlayerEntity, getPlayerPosition } from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import {
  addItemToEntityBackpack,
  clearContainerItemAt,
} from "../inv/containers";
import {
  PlayerActionType,
  PlayerDropItemActionReason,
  type PlayerUnequipItemAction,
} from "../player/types";

export const resolveUnequipAction = (
  state: GameState,
  gameAction: PlayerUnequipItemAction,
): ActionResolution => {
  const { eqSlot: eqSlotIndex } = gameAction;
  const action: Action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    const player = getPlayerEntity(draft);
    const backpack = action.assert(
      getBackpack(player),
      "Player has no backpack",
    );
    const isFull = isContainerFull(backpack);

    const slot = getEqSlot(player, eqSlotIndex);
    const slotName = getEntityName(slot);
    const item = getContainerItemAt(slot, 1);
    if (!item) {
      return action.fail(`No item at ${slotName} EQ slot`);
    }

    if (!isRemovable(item)) {
      return action.fail(`Can't be removed`);
    }

    if (isFull) {
      action.addPending({
        type: PlayerActionType.DROP_ITEM,
        targetPosition: getPlayerPosition(draft),
        eqSlot: eqSlotIndex,
        invSlot: undefined,
        reason: PlayerDropItemActionReason.BACKPACK_FULL,
      });
      return;
    }

    addItemToEntityBackpack(player, item);
    clearContainerItemAt(getEqSlot(player, eqSlotIndex), 1);
    action.success(
      `Unequipped ${getEntityName(item)} from ${slotName} EQ slot`,
    );
  });

  return action.resolve(nextState);
};
