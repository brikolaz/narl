import { produce } from "immer";
import { removeById } from "../../../utils/removeById";
import type { GameState } from "../../state/state";
import {
  addItemToEntityBackpack,
  getBackpack,
  isContainer,
  isContainerFull,
} from "../inv/containers";
import { getItemName } from "../inv/items";
import { Action } from "../turn/actions/action";
import { WorldActionType, type ActionResolution } from "../turn";
import { isPickupable, pickUpItem } from "./pickUp";

export const resolvePickUpAction = (state: GameState): ActionResolution => {
  const action = new Action();
  const nextState = produce(state, (draft) => {
    draft.world.forEach((tile) => {
      if (!tile.player) {
        return;
      }

      const backpack = getBackpack(tile.player);
      if (!backpack) {
        return;
      }
      const itemToPickUp = pickUpItem(tile);
      if (!itemToPickUp) {
        return action.reject("Nothing to pick up");
      }

      if (isContainerFull(backpack)) {
        return action.reject(
          `Can't pick up ${getItemName(itemToPickUp)}. Backpack is full.`,
        );
      }

      if (!isPickupable(itemToPickUp)) {
        return action.reject(`${getItemName(itemToPickUp)} is not pickupable`);
      }
      if (isContainer(itemToPickUp)) {
        action.addPending({
          type: WorldActionType.CURSE_ITEM,
          itemId: itemToPickUp.id,
        });
      }
      addItemToEntityBackpack(tile.player, itemToPickUp, backpack.id);
      removeById(tile.items, itemToPickUp.id);

      action.fulfill(`Picked up ${getItemName(itemToPickUp)}.`);
    });
  });

  return action.resolve(nextState);
};
