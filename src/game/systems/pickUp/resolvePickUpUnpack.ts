import { produce } from "immer";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getBackpack, isContainer, isContainerFull } from "../inv/containers";
import { pickUpItem } from "./pickUp";
import { ItemEntity } from "../../model/entities/items/ItemEntity";
import { CursedComponent } from "../../model/components/CursedComponent";
import {
  addEntity,
  getEntitiesByType,
  removeEntityById,
} from "../../../core/ecs/queries/entities";
import { getComponentByType } from "../../../core/ecs/queries/component";
import {
  PlayerActionType,
  type PlayerPickUpUnpackAction,
} from "../player/types";
import { getItemName } from "../inv/items";

export const resolvePickUpUnpack = (
  state: GameState,
  gameAction: PlayerPickUpUnpackAction,
): ActionResolution => {
  const action = new Action(gameAction);
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
        return action.fail("Can't pick up item. Backpack is full");
      }
      const itemToPickUp = pickUpItem(tile);
      if (!itemToPickUp) {
        return action.fail("Nothing to pick up");
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
            return action.info(`Backpack is full`);
          }
          const nextItem = itemsInContainer.pop();
          if (nextItem) {
            addEntity(backpack, nextItem);
            removeEntityById(itemToPickUp, nextItem.id);
            action.success(`Picked up ${getItemName(nextItem)}`);
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
