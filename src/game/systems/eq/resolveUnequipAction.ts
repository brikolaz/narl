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
import {
  PlayerActionType,
  PlayerDropItemActionReason,
  type PlayerUnequipItemAction,
} from "../player/types";
import { getEqSlotAt } from "../../model/queries/eq";
import { getEntityName } from "../inspect/getEntityName";

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
    const slotName = getEntityName(slot);
    const item = getContainerItemAt(slot, 1);
    if (!item) {
      return action.fail(`No item at ${slotName} EQ slot`);
    }

    addItemToEntityBackpack(player, item);
    clearContainerItemAt(getEqSlotAt(player, eqSlotIndex), 1);
    action.success(
      `Unequipped ${getEntityName(item)} from ${slotName} EQ slot`,
    );
  });

  return action.resolve(nextState);
};
