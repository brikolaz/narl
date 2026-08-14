import type { Entity } from "../../../core/model/Entity";
import { assert } from "../../../utils/assert";
import { getManual } from "../../model/entities/getManual";
import {
  getBackpack,
  getContainerItemAt,
  getFirstContainerItem,
} from "../../model/queries/containers";
import { isDisabled } from "../../model/queries/disabled";
import { getEq } from "../../model/queries/eq";
import { getItemSlots } from "../../model/queries/items";
import { getPlayer } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { addItemToContainer } from "../containers/containers";
import { curse } from "../curse/curse";
import { getEntityName } from "../inspect/getEntityName";
import type { PlayerEquipItemAction } from "../player/types";

const getCompatibleEqSlot = (
  player: Entity,
  item: Entity,
): Entity | undefined => {
  const itemSlots = getItemSlots(item);

  if (itemSlots.length > 1) {
    throw new Error(`Entity can have only one EQ slot component`);
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
    const player = getPlayer();
    const backpack = assert(getBackpack(player), "Player has no backpack");

    const itemToEquip = getContainerItemAt(backpack, invSlotIndex);
    if (!itemToEquip) {
      return action.fail(`No item to equip`);
    }

    const eqSlot = getCompatibleEqSlot(player, itemToEquip);
    if (!eqSlot) {
      return action.fail(
        `${getEntityName(itemToEquip)} can't be equipped`,
      );
    }
    
    const itemInSlot = getFirstContainerItem(eqSlot);
    const eqSlotName = getEntityName(eqSlot);

    if (
      isDisabled(eqSlot) &&
      !getManual(eqSlot)?.canAdd?.(eqSlot, itemToEquip)
    ) {
      return action.fail(`Can't equip to disabled ${eqSlotName} slot`);
    }
    if (itemInSlot) {
      return action.fail(
        `Can't equip. ${getEntityName(itemInSlot)} in ${eqSlotName} slot`,
      );
    }

    addItemToContainer(eqSlot, itemToEquip);
    action.success(
      `Equipped ${getEntityName(itemToEquip)}`,
    );
    curse(action, itemToEquip);
  })();

  return action.resolve();
};
