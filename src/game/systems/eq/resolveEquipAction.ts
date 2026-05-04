import { produce } from "immer";
import { addEntity, removeEntityById } from "../../../core/ecs";
import type { ItemSlotComponent } from "../../model/components/eq/ItemSlotComponent";
import { getPlayer } from "../../state";
import type { GameState } from "../../state/state";
import { getItemSlots } from "../inv/getItemSlots";
import { getBackpack, getBackpackItem } from "../pickUp";
import type { ActionResolution, EqSlot, InvSlot } from "../turn";

import { getEq, getEqSlots } from "./getEq";
import { Action } from "../log";

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
): ActionResolution<GameState> => {
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
