import { produce } from "immer";
import { getPlayer, getPlayerPosition } from "../../state";
import type { GameState } from "../../state/state";
import {
  Action,
  WorldActionEntityType,
  WorldActionType,
  type ActionResolution,
  
} from "../turn";

import { addItemToEntityBackpack, getBackpack, isContainerFull } from "../inv";
import { getItemName } from "../inv/items";
import { unequipWeapon } from "./eq";
import type { EqSlot } from "./types";

export const resolveUnequipAction = (
  state: GameState,
  eqSlotIndex: EqSlot,
): ActionResolution => {
  const action = new Action();
  const nextState = produce(state, (draft) => {
    const player = getPlayer(draft);
    const backpack = getBackpack(player);
    if (!backpack) {
      throw new Error("Player has no backpack");
    }

    const isFull = isContainerFull(backpack);
    const equippedWeapon = unequipWeapon(player, eqSlotIndex - 1);
    if (!equippedWeapon) {
      return action.reject(`No item in slot ${eqSlotIndex} to unequip.`);
    }

    if (isFull) {
      const playerTile = draft.world.find((tile) => tile.player);
      if (!playerTile) {
        throw new Error("Player has no tile");
      }
      playerTile.items.push(equippedWeapon);
      action.addPending({
        type: WorldActionType.DROP_ITEM,
        entityType: WorldActionEntityType.PLAYER,
        itemId: equippedWeapon.id,
        targetPosition: getPlayerPosition(draft),
        entityId: undefined,
      });
      return action.fulfill(`Backpack is full. Dropped to the ground`);
    }

    addItemToEntityBackpack(player, equippedWeapon, backpack.id);
    action.fulfill(
      `Unequipped ${getItemName(equippedWeapon)} from slot ${eqSlotIndex}`,
    );
  });

  return action.resolve(nextState);
};
