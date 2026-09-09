import { removeById } from "../../../utils/removeById";
import { getPlayer } from "../player/player";
import { getPosition } from "../position/position";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  addItemToEntityBackpack,
} from "../containers/containers";
import {
  getBackpack,
  isContainerFull,
} from "../containers/containers";
import type { PlayerPickUpAction } from "../player/types";
import { isPickupable, pickUpItem } from "./pickUp";
import { getVisibleTiles } from "../player/getVisibleTiles";
import { getEntityName } from "../inspect/getEntityName";
import { curse } from "../curse/curse";

export const resolvePickUpAction = (
  gameAction: PlayerPickUpAction,
): ActionResolution => {
  const action = new Action(gameAction);
  (() => {
    const player = getPlayer();
    const playerPosition = getPosition(player);
    getVisibleTiles().forEach((tile) => {
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
          `Can't pick up ${getEntityName(itemToPickUp)}. Backpack is full`,
        );
      }

      if (!isPickupable(itemToPickUp)) {
        return action.fail(`${getEntityName(itemToPickUp)} is not pickupable`);
      }
      addItemToEntityBackpack(player, itemToPickUp);
      removeById(tile.items, itemToPickUp.id);
      action.success(`Picked up ${getEntityName(itemToPickUp)}`);
      curse(action, itemToPickUp);
    });
  })();

  return action.resolve();
};
