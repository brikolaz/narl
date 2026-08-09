import type { Component } from "../../../core/model/Component";
import type { Entity } from "../../../core/model/Entity";
import { assert } from "../../../utils/assert";
import { getManual } from "../../model/entities/getManual";
import {
  getBackpack,
  getContainerItemAt,
  getFirstContainerItem,
} from "../../model/queries/containers";
import { getItemSlots } from "../../model/queries/items";
import { getPlayerEntity } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { addItemToContainer } from "../containers/containers";
import { curse } from "../curse/curse";
import { isDisabled } from "../../model/queries/disabled";
import { getEntityName } from "../inspect/getEntityName";
import type { PlayerEquipItemAction } from "../player/types";
import { getEq } from "../../model/queries/eq";

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

const getCompatibleEqSlot = (
  player: Entity,
  item: Entity,
): Entity | undefined => {
  const itemSlots = getItemSlots(item);

  if (itemSlots.length > 1) {
    throw new Error(
      `Entity can have only one EQ slot component`,
    );
  }

  const itemSlot = itemSlots[0];
  if (!itemSlot) {
    return undefined;
  }

  return getEq(player).find((slot) =>
    getItemSlots(slot).some((eqItemSlot) => eqItemSlot.type === itemSlot.type),
  );
};

export const resolveEquipAction = (
  gameAction: PlayerEquipItemAction,
): ActionResolution => {
  const { invSlot: invSlotIndex } = gameAction;
  const action = new Action(gameAction);
  (() => {
    const player = getPlayerEntity();
    const backpack = assert(
      getBackpack(player),
      "Player has no backpack",
    );

    const itemToEquip = getContainerItemAt(backpack, invSlotIndex);
    if (!itemToEquip) {
      return action.fail(`No item in INV slot ${invSlotIndex} to equip`);
    }

    const eqSlot = getCompatibleEqSlot(player, itemToEquip);
    if (!eqSlot) {
      return action.fail(
        `${getEntityName(itemToEquip)} from INV slot ${invSlotIndex} can't be equipped`,
      );
    }
    const eqItemSlots = getItemSlots(eqSlot);
    const itemSlots = getItemSlots(itemToEquip);
    const itemInSlot = getFirstContainerItem(eqSlot);
    const eqSlotName = getEntityName(eqSlot);

    if (
      isDisabled(eqSlot) &&
      !getManual(eqSlot)?.canAdd?.(eqSlot, itemToEquip)
    ) {
      return action.fail(`Can't equip. ${eqSlotName} slot is disabled`);
    }
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

    action.success(
      `Equipped ${getEntityName(itemToEquip)} from INV slot ${invSlotIndex} to ${eqSlotName} EQ slot`,
    );
    curse(action, itemToEquip);
  })();

  return action.resolve();
};
