import { produce } from "immer";
import {
  addEntity,
  getComponentByType,
  getEntitiesByType,
  removeEntityById
} from "../../../core/ecs";
import { ItemEntity } from "../../model";
import { CursedComponent } from "../../model/components/CursedComponent";
import type { GameState } from "../../state/state";
import {
  getBackpack,
  isContainer,
  isContainerFull
} from "../inv/containers";
import { getItemName } from "../inv/items";
import { Action } from "../turn/actions/action";
import { PlayerActionType, type ActionResolution } from "../turn";
import { pickUpItem } from "./pickUp";

export const resolvePickUpUnpack = (state: GameState): ActionResolution => {
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
      if (isContainerFull(backpack)) {
        return action.reject("Can't pick up item. Backpack is full.");
      }
      const itemToPickUp = pickUpItem(tile);
      if (!itemToPickUp) {
        return action.reject("Nothing to pick up");
      }

      if (isContainer(itemToPickUp)) {
        const itemsInContainer = getEntitiesByType(itemToPickUp, ItemEntity);
        const isCursed = getComponentByType(itemToPickUp, CursedComponent);
        if (!itemsInContainer.length || isCursed) {
          return action.addPending({
            type: PlayerActionType.PICK_UP,
          });
        }
        while (itemsInContainer.length) {
          if (isContainerFull(backpack)) {
            return action.log(`Backpack is full`);
          }
          const nextItem = itemsInContainer.pop();
          if (nextItem) {
            addEntity(backpack, nextItem);
            removeEntityById(itemToPickUp, nextItem.id);
            action.fulfill(`Picked up ${getItemName(nextItem)}`);
          }
        }
        return;
      }
      action.addPending({
        type: PlayerActionType.PICK_UP,
      });
    });
  });

  return action.resolve(nextState);
};
