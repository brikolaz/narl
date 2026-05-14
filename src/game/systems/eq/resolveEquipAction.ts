import { produce } from "immer";
import { addEntity, removeEntityById } from "../../../core/ecs/queries/entities";
import type { ItemSlotComponent } from "../../model/components/eq/ItemSlotComponent";
import { getPlayer } from "../../state/selectors/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getBackpack, getBackpackItem } from "../inv/containers";
import { getItemSlots } from "../inv/getItemSlots";
import { getItemName } from "../inv/items";
import type { PlayerEquipItemAction } from "../player/types";
import { getEq, getEqSlots, getEquippedWeapon } from "./eq";

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
  { invSlot: invSlotIndex, eqSlot: eqSlotIndex }: PlayerEquipItemAction,
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
      return action.fail(`No item in slot ${invSlotIndex} to equip.`);
    }

    const eqSlot = getEqSlots(player)[eqSlotIndex - 1];
    const eqItemSlots = getItemSlots(eqSlot);
    const itemSlots = getItemSlots(itemToEquip);
    const equippedWeapon = getEquippedWeapon(player);
    if (equippedWeapon) {
      return action.fail(
        `Can't equip. ${getItemName(equippedWeapon)} in slot ${eqSlotIndex}.`,
      );
    }
    if (!canBeEquipped(itemSlots, eqItemSlots)) {
      return action.fail(
        `${getItemName(itemToEquip)} in ${invSlotIndex} can't be equipped in eq slot ${eqSlotIndex}.`,
      );
    }

    const eq = getEq(player);
    if (!eq) {
      throw new Error("Player has no equipment");
    }

    removeEntityById(backpack, itemToEquip.id);
    addEntity(eqSlot, itemToEquip);

    action.success(
      `Equipped item from slot ${invSlotIndex} to eq slot ${eqSlotIndex}.`,
    );
  });

  return action.resolve(nextState);
};
