import { produce } from "immer";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { PlayerUnequipItemAction } from "../player/types";
import { getPlayer, getPlayerPosition } from "../../state/selectors/player";
import {
  addItemToEntityBackpack,
  getBackpack,
  isContainerFull,
} from "../inv/containers";
import { unequipWeapon } from "./eq";
import { WorldActionEntityType, WorldActionType } from "../world/types";
import { getItemName } from "../inv/items";

export const resolveUnequipAction = (
  state: GameState,
  gameAction: PlayerUnequipItemAction,
): ActionResolution => {
  const { eqSlot: eqSlotIndex } = gameAction;
  const action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    const player = getPlayer(draft);
    const backpack = getBackpack(player);
    if (!backpack) {
      throw new Error("Player has no backpack");
    }

    const isFull = isContainerFull(backpack);
    const equippedWeapon = unequipWeapon(player, eqSlotIndex - 1);
    if (!equippedWeapon) {
      return action.fail(`No item in slot ${eqSlotIndex} to unequip`);
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
      return action.success(`Backpack is full. Dropped to the ground`);
    }

    addItemToEntityBackpack(player, equippedWeapon, backpack.id);
    action.success(
      `Unequipped ${getItemName(equippedWeapon)} from EQ slot ${eqSlotIndex}`,
    );
  });

  return action.resolve(nextState);
};
