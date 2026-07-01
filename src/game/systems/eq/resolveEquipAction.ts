import { produce } from "immer";
import type { ItemSlotComponent } from "../../model/components/eq/ItemSlotComponent";
import { getPlayerEntity } from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { addItemToContainer, clearContainerItemById } from "../inv/containers";
import {
  getBackpack,
  getContainerItemAt,
  getFirstContainerItem,
} from "../../model/queries/containers";
import { getItemSlots } from "../../model/queries/items";
import type { PlayerEquipItemAction } from "../player/types";
import { getEqSlot } from "../../model/queries/eq";
import { getEntityName } from "../inspect/getEntityName";
import { curse } from "../curse/curse";

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
    curse(itemToEquip, draft, action);
  });

  return action.resolve(nextState);
};
