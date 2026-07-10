import type { Component } from "../../../core/ecs/Component";
import {
  getBackpack,
  getContainerItemAt,
  getFirstContainerItem,
} from "../../model/queries/containers";
import { getEqSlot } from "../../model/queries/eq";
import { getItemSlots } from "../../model/queries/items";
import { getPlayerEntity } from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { curse } from "../curse/curse";
import { getEntityName } from "../inspect/getEntityName";
import { addItemToContainer, clearContainerItemById } from "../inv/containers";
import type { PlayerEquipItemAction } from "../player/types";

const canBeEquipped = (
  itemSlots: Component[],
  eqSlots: Component[],
): boolean => {
  const uniqueSlots = new Set([
    ...itemSlots.map((slot) => slot.type),
    ...eqSlots.map((slot) => slot.type),
  ]);
  return itemSlots.length + eqSlots.length > uniqueSlots.size;
};

export const resolveEquipAction = (
  state: GameState,
  gameAction: PlayerEquipItemAction,
): ActionResolution => {
  const { invSlot: invSlotIndex, eqSlot: eqSlotIndex } = gameAction;
  const action = new Action(gameAction);
  (() => {
    const player = getPlayerEntity(state);
    const backpack = action.assert(
      getBackpack(player),
      "Player has no backpack",
    );

    const itemToEquip = getContainerItemAt(backpack, invSlotIndex);
    if (!itemToEquip) {
      return action.fail(`No item in INV slot ${invSlotIndex} to equip`);
    }

    const eqSlot = getEqSlot(player, eqSlotIndex);
    const eqItemSlots = getItemSlots(eqSlot);
    const itemSlots = getItemSlots(itemToEquip);
    const itemInSlot = getFirstContainerItem(eqSlot);
    const eqSlotName = getEntityName(eqSlot);

    if (itemInSlot) {
      return action.fail(
        `Can't equip. ${getEntityName(itemInSlot)} in ${eqSlotName} EQ slot`,
      );
    }
    if (!canBeEquipped(itemSlots, eqItemSlots)) {
      return action.fail(
        `${getEntityName(itemToEquip)} from INV slot ${invSlotIndex} can't be equipped in ${eqSlotName} EQ slot`,
      );
    }

    addItemToContainer(eqSlot, itemToEquip);
    clearContainerItemById(backpack, itemToEquip.id);

    action.success(
      `Equipped ${getEntityName(itemToEquip)} from INV slot ${invSlotIndex} to ${eqSlotName} EQ slot`,
    );
    curse(itemToEquip, state, action);
  })();

  return action.resolve(state);
};
