import { produce } from "immer";
import type { ItemSlotComponent } from "../../model/components/eq/ItemSlotComponent";
import { getPlayerEntity } from "../../state/selectors/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  addItemToContainer,
  clearContainerItemById,
  getBackpack,
  getContainerItemAt,
} from "../inv/containers";
import { getItemSlots } from "../inv/getItemSlots";
import { getItemName } from "../inv/items";
import type { PlayerEquipItemAction } from "../player/types";
import { getEq, getEqSlotAt, getEquippedWeapon } from "./eq";

const canBeEquipped = (
  itemSlots: ItemSlotComponent[],
  eqSlots: ItemSlotComponent[],
): boolean => {
  const uniqueSlots = new Set([
    ...itemSlots.map((slot) => Object.getPrototypeOf(slot)),
    ...eqSlots.map((slot) => Object.getPrototypeOf(slot)),
  ]);
  return itemSlots.length + eqSlots.length > uniqueSlots.size;
};

export const resolveEquipAction = (
  state: GameState,
  gameAction: PlayerEquipItemAction,
): ActionResolution => {
  const { invSlot: invSlotIndex, eqSlot: eqSlotIndex } = gameAction;
  const action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    const player = getPlayerEntity(draft);
    const backpack = getBackpack(player);
    if (!backpack) {
      throw new Error("Player has no backpack");
    }

    const itemToEquip = getContainerItemAt(backpack, invSlotIndex);
    if (!itemToEquip) {
      return action.fail(`No item in slot ${invSlotIndex} to equip`);
    }

    const eqSlot = getEqSlotAt(player, eqSlotIndex);
    const eqItemSlots = getItemSlots(eqSlot);
    const itemSlots = getItemSlots(itemToEquip);
    const equippedWeapon = getEquippedWeapon(player);
    if (equippedWeapon) {
      return action.fail(
        `Can't equip. ${getItemName(equippedWeapon)} in slot ${eqSlotIndex}`,
      );
    }
    if (!canBeEquipped(itemSlots, eqItemSlots)) {
      return action.fail(
        `${getItemName(itemToEquip)} in ${invSlotIndex} can't be equipped in eq slot ${eqSlotIndex}`,
      );
    }

    const eq = getEq(player);
    if (!eq) {
      throw new Error("Player has no equipment");
    }

    addItemToContainer(eqSlot, itemToEquip);
    clearContainerItemById(backpack, itemToEquip.id);

    action.success(
      `Equipped ${getItemName(itemToEquip)} from slot ${invSlotIndex} to EQ slot ${eqSlotIndex}`,
    );
  });

  return action.resolve(nextState);
};
