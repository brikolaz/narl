import { produce } from "immer";
import { getPlayer, getPlayerPosition } from "../../state";
import type { GameState } from "../../state/state";
import {
  WorldActionEntityType,
  WorldActionType,
  type ActionResolution,
  type EqSlot,
} from "../turn";

import { addItemToEntityBackpack, getBackpack, isBackpackFull } from "../inv";
import { Action } from "../log";
import { unequipWeapon } from "./eq";

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

    const isFull = isBackpackFull(backpack);
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
    action.fulfill(`Unequipped item from slot ${eqSlotIndex}`);
  });

  return action.resolve(nextState);
};
