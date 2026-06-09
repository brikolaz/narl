import { produce } from "immer";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { CursedComponent } from "../../model/components/CursedComponent";
import { getPlayer } from "../../state/selectors/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  addItemToEntityBackpack,
  clearContainerItemById,
  getBackpack,
  getFirstContainerItem,
  isContainer,
  isContainerFull,
} from "../inv/containers";
import { getItemName } from "../inv/items";
import {
  PlayerActionType,
  type PlayerPickUpUnpackAction,
} from "../player/types";
import { getVisibleTiles } from "../render/getVisibleTiles";
import { pickUpItem } from "./pickUp";

export const resolvePickUpUnpack = (
  state: GameState,
  gameAction: PlayerPickUpUnpackAction,
): ActionResolution => {
  const action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    const { player, position: playerPosition } = getPlayer(draft);
    getVisibleTiles(draft).forEach((tile) => {
      if (playerPosition !== tile.position) {
        return;
      }

      const backpack = getBackpack(player);
      if (!backpack) {
        return;
      }
      const itemToPickUp = pickUpItem(tile);
      if (!itemToPickUp) {
        return action.fail("Nothing to pick up");
      }
      if (isContainerFull(backpack)) {
        return action.fail("Can't pick up item. Backpack is full");
      }

      if (isContainer(itemToPickUp)) {
        const isCursed = getComponentByType(itemToPickUp, CursedComponent);
        let nextItem = getFirstContainerItem(itemToPickUp);
        if (!nextItem || isCursed) {
          return action.addPending({
            type: PlayerActionType.PICK_UP,
          });
        }
        while (nextItem) {
          if (isContainerFull(backpack)) {
            return action.info(`Backpack is full`);
          }
          addItemToEntityBackpack(player, nextItem);
          clearContainerItemById(itemToPickUp, nextItem.id);
          action.success(`Picked up ${getItemName(nextItem)}`);
          nextItem = getFirstContainerItem(itemToPickUp);
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
