import { produce } from "immer";
import {
  getPlayerEntity,
  getPlayerPosition,
} from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  addItemToEntityBackpack,
  clearContainerItemAt,
} from "../inv/containers";
import {
  getBackpack,
  getContainerItemAt,
  isContainerFull,
} from "../../model/queries/containers";
import { getItemName } from "../../model/queries/items";
import {
  PlayerActionType,
  PlayerDropItemActionReason,
  type PlayerUnequipItemAction,
} from "../player/types";
import { getEqSlotAt, getEqSlotName } from "../../model/queries/eq";

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

    const slot = getEqSlotAt(player, eqSlotIndex);
    const item = getContainerItemAt(slot, 1);
    if (!item) {
      return action.fail(
        `No item at ${getEqSlotName(player, eqSlotIndex)} EQ slot`,
      );
    }

    addItemToEntityBackpack(player, item);
    clearContainerItemAt(getEqSlotAt(player, eqSlotIndex), 1);
    action.success(
      `Unequipped ${getItemName(item)} from ${getEqSlotName(player, eqSlotIndex)} EQ slot`,
    );
  });

  return action.resolve(nextState);
};
