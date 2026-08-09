import {
  getBackpack,
  isContainer,
  isContainerFull
} from "../../model/queries/containers";
import { assert } from "../../../utils/assert";
import { isCursed } from "../../model/queries/curse";
import { pickUpItem } from "../../model/queries/pickUp";
import { getPlayer } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { unpackContainer } from "../containers/containers";
import { getEntityName } from "../inspect/getEntityName";
import { getVisibleTiles } from "../player/getVisibleTiles";
import {
  PlayerActionType,
  type PlayerPickUpUnpackAction,
} from "../player/types";
import { replaceFloorItem } from "./pickUp";

export const resolvePickUpUnpack = (
  gameAction: PlayerPickUpUnpackAction,
): ActionResolution => {
  const action: Action = new Action(gameAction);
  (() => {
    const { player, position: playerPosition } = getPlayer();
    getVisibleTiles().forEach((tile) => {
      if (playerPosition !== tile.position) {
        return;
      }

      const backpack = assert(
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
        return action.addPendingImmediateAction({
          type: PlayerActionType.PICK_UP,
        });
      }
      const unpackedContainer = unpackContainer(itemToPickUp);
      replaceFloorItem(tile, itemToPickUp.id, ...unpackedContainer);
      action.addPendingImmediateAction({
        type: PlayerActionType.PICK_UP,
      });
      if (unpackedContainer.length > 1) {
        return action.info(
          `Dropped ${getEntityName(itemToPickUp)} items to the floor`,
        );
      }
    });
  })();

  return action.resolve();
};
