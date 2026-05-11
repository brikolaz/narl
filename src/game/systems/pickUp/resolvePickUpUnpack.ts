import { produce } from "immer";
import {
  addEntity,
  getComponentByType,
  getEntitiesByType,
  hasComponentByType,
  removeEntityById,
} from "../../../core/ecs";
import { ItemEntity } from "../../model";
import { NameComponent } from "../../model/components/AppearanceComponent copy";
import { ContainerComponent } from "../../model/components/ContainerComponent";
import type { GameState } from "../../state/state";
import {
  addItemToEntityBackpack,
  getBackpack,
  isBackpackFull,
} from "../inv/containers";
import { Action } from "../log/action";
import { PlayerActionType, type ActionResolution } from "../turn";
import { pickUpItem } from "./pickUp";
import { CursedComponent } from "../../model/components/CursedComponent";

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
      if (isBackpackFull(backpack)) {
        return action.reject("Can't pick up item. Backpack is full.");
      }
      const itemToPickUp = pickUpItem(tile);
      if (!itemToPickUp) {
        return action.reject("Nothing to pick up");
      }
      const isContainer = hasComponentByType(itemToPickUp, ContainerComponent);
      if (isContainer) {
        const itemsInContainer = getEntitiesByType(itemToPickUp, ItemEntity);
        const isCursed = getComponentByType(itemToPickUp, CursedComponent);
        if (!itemsInContainer.length || isCursed) {
          return action.addPending({
            type: PlayerActionType.PICK_UP,
          });
        }
        while (itemsInContainer.length) {
          if (isBackpackFull(backpack)) {
            return action.log(`Backpack is full`);
          }
          const nextItem = itemsInContainer.pop();
          if (nextItem) {
            addEntity(backpack, nextItem);
            removeEntityById(itemToPickUp, nextItem.id);
            const nextItemName = getComponentByType(
              nextItem,
              NameComponent,
            )?.name;
            action.fulfill(`Picked up ${nextItemName}`);
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
