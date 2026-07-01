import type { Entity } from "../../../core/ecs/Entity";
import {
  getEntitiesByType,
  getEntityByType,
  isEntityType,
} from "../../../core/ecs/queries/entities";
import { EqEntity } from "../entities/eq/EqEntity";
import { EqSlotEntity } from "../entities/eq/EqSlotEntity";
import type { ItemEntity } from "../entities/items/ItemEntity";
import { getContainerItemAt, getContainerItems } from "./containers";
import { EqSlot } from "../../systems/eq/types";
import { EQ_SLOT_TO_ENTITY } from "../entities/eq/mapping";
import { RingSlotEntity } from "../entities/eq/slots/RingSlotEntity";

export const getEq = (entity: Entity): EqEntity | undefined => {
  return getEntityByType(entity, EqEntity);
};

export const getEqSlots = (entity: Entity) => {
  const eq = getEq(entity);
  return getEntitiesByType(eq, EqSlotEntity);
};

export const getEqItems = (entity: Entity) => {
  const eq = getEqSlots(entity);
  const items = eq.flatMap((item) => getContainerItems(item));
  return items;
};

// TODO: get rid of this shit
export const getEqSlot = (entity: Entity, slot: EqSlot) => {
  const eqSlots = getEqSlots(entity);
  let targetSlot = undefined;
  if (slot === EqSlot.RING1 || slot === EqSlot.RING2) {
    const targetSlots = eqSlots.filter((s) => isEntityType(s, RingSlotEntity));
    targetSlot = targetSlots[slot === EqSlot.RING1 ? 0 : 1];
  } else {
    targetSlot = getEqSlots(entity).find((s) => {
      const slotEntity = EQ_SLOT_TO_ENTITY.get(slot);
      return slotEntity ? isEntityType(s, slotEntity) : false;
    });
  }
  if (!targetSlot) {
    throw new Error(`No EQ slot`);
  }
  return targetSlot;
};

export const getEquippedWeapon = (entity: Entity): ItemEntity | undefined => {
  const slot = getEqSlot(entity, EqSlot.MAIN_HAND);
  return getContainerItemAt(slot, 1);
};
