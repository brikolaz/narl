import { produce } from "immer";
import { getComponentByType, hasComponentByType } from "../../../core/ecs";
import { removeById } from "../../../utils/removeById";
import { NameComponent } from "../../model/components/AppearanceComponent copy";
import { ContainerComponent } from "../../model/components/ContainerComponent";
import type { GameState } from "../../state/state";
import { isCursed } from "../curse/cursed";
import {
  addItemToEntityBackpack,
  getBackpack,
  isBackpackFull,
} from "../inv/containers";
import { Action } from "../log/action";
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
      if (isBackpackFull(backpack)) {
        return action.reject("Can't pick up item. Backpack is full.");
      }
      const itemToPickUp = pickUpItem(tile);

      if (!itemToPickUp) {
        return action.reject("Nothing to pick up");
      }
      const itemName = getComponentByType(itemToPickUp, NameComponent)?.name;
      if (!isPickupable(itemToPickUp)) {
        return action.reject(`${itemName} is not pickupable`);
      }
      const isContainer = hasComponentByType(itemToPickUp, ContainerComponent);
      if (isContainer) {
        action.addPending({
          type: WorldActionType.CURSE_ITEM,
          itemId: itemToPickUp.id,
        });
      }
      addItemToEntityBackpack(tile.player, itemToPickUp, backpack.id);
      removeById(tile.items, itemToPickUp.id);

      action.fulfill(
        `Player picked up a ${isCursed(itemToPickUp) ? "Cursed " : ""}${itemName}.`,
      );
    });
  });

  return action.resolve(nextState);
};
