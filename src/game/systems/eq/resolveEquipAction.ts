import { produce } from "immer";
import { addEntity, getComponentByType, removeEntityById } from "../../../core/ecs";
import type { ItemSlotComponent } from "../../model/components/eq/ItemSlotComponent";
import { getPlayer } from "../../state";
import type { GameState } from "../../state/state";
import { getItemSlots } from "../inv/getItemSlots";
import type { ActionResolution, EqSlot, InvSlot } from "../turn";

import { Action } from "../log";
import { getEq, getEqSlots, getEquippedWeapon } from "./eq";
import { getBackpack, getBackpackItem } from "../inv";
import { NameComponent } from "../../model/components/AppearanceComponent copy";

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
  invSlotIndex: InvSlot,
  eqSlotIndex: EqSlot,
): ActionResolution => {
  const action = new Action();
  const nextState = produce(state, (draft) => {
    const player = getPlayer(draft);
    const backpack = getBackpack(player);
    if (!backpack) {
      throw new Error("Player has no backpack");
    }

    const itemToEquip = getBackpackItem(backpack, invSlotIndex);
    if (!itemToEquip) {
      return action.reject(`No item in slot ${invSlotIndex} to equip.`);
    }

    const eqSlot = getEqSlots(player)[eqSlotIndex - 1];
    const eqItemSlots = getItemSlots(eqSlot);
    const itemSlots = getItemSlots(itemToEquip);
    const equippedWeapon = getEquippedWeapon(player)
    if(equippedWeapon) {
      const weaponName = getComponentByType(equippedWeapon, NameComponent)?.name
      return action.reject(
        `Can't equip. ${weaponName} in slot ${eqSlotIndex}.`,
      );;
    }
    if (!canBeEquipped(itemSlots, eqItemSlots)) {
      return action.reject(
        `Item in slot ${invSlotIndex} can't be equipped in eq slot ${eqSlotIndex}.`,
      );;
    }

    const eq = getEq(player);
    if (!eq) {
      throw new Error("Player has no equipment");
    }

    removeEntityById(backpack, itemToEquip.id);
    addEntity(eqSlot, itemToEquip);

    action.fulfill(
      `Equipped item from slot ${invSlotIndex} to eq slot ${eqSlotIndex}.`,
    );
  });

  return action.resolve(nextState);
};
