import { produce } from "immer";
import { removeById } from "../../../utils/removeById";
import { getPlayer } from "../../state/selectors/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  addItemToEntityBackpack,
  getBackpack,
  isContainer,
  isContainerFull,
} from "../inv/containers";
import { getItemName } from "../inv/items";
import type { PlayerPickUpAction } from "../player/types";
import { WorldActionType } from "../world/types";
import { isPickupable, pickUpItem } from "./pickUp";
import { getVisibleTiles } from "../render/getVisibleTiles";

export const resolvePickUpAction = (
  state: GameState,
  gameAction: PlayerPickUpAction,
): ActionResolution => {
  const action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    const {player, position: playerPosition} = getPlayer(draft);
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
      if (isContainer(itemToPickUp)) {
        action.addPending({
          type: WorldActionType.CURSE_ITEM,
          itemId: itemToPickUp.id,
        });
      }
      addItemToEntityBackpack(player, itemToPickUp);
      removeById(tile.items, itemToPickUp.id);

      action.success(`Picked up ${getItemName(itemToPickUp)}`);
    });
  });

  return action.resolve(nextState);
};
