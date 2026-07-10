import { removeById } from "../../../utils/removeById";
import { getPlayer } from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { isCursed } from "../../model/queries/curse";
import {
  clearContainerItems,
} from "../inv/containers";
import {
  getBackpack,
  getContainerItems,
  isContainer,
  isContainerFull,
} from "../../model/queries/containers";
import {
  PlayerActionType,
  type PlayerPickUpUnpackAction,
} from "../player/types";
import { getVisibleTiles } from "../render/getVisibleTiles";
import { pickUpItem } from "../../model/queries/pickUp";
import { getEntityName } from "../inspect/getEntityName";

export const resolvePickUpUnpack = (
  state: GameState,
  gameAction: PlayerPickUpUnpackAction,
): ActionResolution => {
  const action: Action = new Action(gameAction);
  (() => {
    const { player, position: playerPosition } = getPlayer(state);
    getVisibleTiles(state).forEach((tile) => {
      if (playerPosition !== tile.position) {
        return;
      }

      const backpack = action.assert(
        getBackpack(player),
        "Player has no backpack.",
      );

      const itemToPickUp = pickUpItem(tile);
      if (!itemToPickUp) {
        return action.fail("Nothing to pick up");
      }
      if (isContainerFull(backpack)) {
        return action.fail("Can't pick up item. Backpack is full");
      }

      if (!isContainer(itemToPickUp) || isCursed(itemToPickUp)) {
        return action.addPending({
          type: PlayerActionType.PICK_UP,
        });
      }
      const containerItems = getContainerItems(itemToPickUp);
      clearContainerItems(itemToPickUp);
      removeById(tile.items, itemToPickUp.id);
      tile.items.push(...containerItems, itemToPickUp);
      action.addPending({
        type: PlayerActionType.PICK_UP,
      });
      if (containerItems.length) {
        return action.info(
          `Dropped ${getEntityName(itemToPickUp)} items to the floor`,
        );
      }
    });
  })();

  return action.resolve(state);
};
