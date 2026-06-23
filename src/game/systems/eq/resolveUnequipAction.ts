import { produce } from "immer";
import {
  getPlayerEntity,
  getPlayerPosition,
} from "../../state/selectors/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  addItemToEntityBackpack,
  clearContainerItemAt,
  getBackpack,
  getContainerItemAt,
  isContainerFull,
} from "../inv/containers";
import { getItemName } from "../inv/items";
import {
  PlayerActionType,
  PlayerDropItemActionReason,
  type PlayerUnequipItemAction,
} from "../player/types";
import { getEqSlotAt } from "./eq";

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
      return action.fail(`No item at slot ${eqSlotIndex}`);
    }

    addItemToEntityBackpack(player, item);
    clearContainerItemAt(getEqSlotAt(player, eqSlotIndex), 1);
    action.success(
      `Unequipped ${getItemName(item)} from EQ slot ${eqSlotIndex}`,
    );
  });

  return action.resolve(nextState);
};
