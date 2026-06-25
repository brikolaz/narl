import { produce } from "immer";
import { removeById } from "../../../utils/removeById";
import { getPlayer } from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  addItemToEntityBackpack,
} from "../inv/containers";
import {
  getBackpack,
  isContainerFull,
} from "../../model/queries/containers";
import { getItemName } from "../../model/queries/items";
import type { PlayerPickUpAction } from "../player/types";
import { isPickupable, pickUpItem } from "../../model/queries/pickUp";
import { getVisibleTiles } from "../render/getVisibleTiles";
import { curse } from "../curse/curse";

export const resolvePickUpAction = (
  state: GameState,
  gameAction: PlayerPickUpAction,
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
        return action.fail(
          `Can't pick up ${getItemName(itemToPickUp)}. Backpack is full`,
        );
      }

      if (!isPickupable(itemToPickUp)) {
        return action.fail(`${getItemName(itemToPickUp)} is not pickupable`);
      }
      addItemToEntityBackpack(player, itemToPickUp);
      removeById(tile.items, itemToPickUp.id);
      action.success(`Picked up ${getItemName(itemToPickUp)}`);
      curse(itemToPickUp, action);
    });
  });

  return action.resolve(nextState);
};
