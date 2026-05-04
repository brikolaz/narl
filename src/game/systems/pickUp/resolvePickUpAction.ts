import { produce } from "immer";
import { getComponentByType } from "../../../core/ecs";
import { NameComponent } from "../../model/components/AppearanceComponent copy";
import type { GameState } from "../../state/state";
import {
  addItemToEntityBackpack,
  getBackpack,
  isBackpackFull,
} from "../inv/backpack";
import { Action } from "../log/action";
import type { ActionResolution } from "../turn";
import { pickUpItem } from "./pickUp";

export const resolvePickUpAction = (
  state: GameState,
): ActionResolution<GameState> => {
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
        return;
      }
      addItemToEntityBackpack(tile.player, itemToPickUp, backpack.id);

      const itemName = getComponentByType(itemToPickUp, NameComponent)?.name;
      action.fulfill(`Player picked up a ${itemName}.`);
    });
  });

  return action.resolve(nextState);
};
