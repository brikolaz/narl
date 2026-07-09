import { EntityRole, type Entity } from "../../../core/ecs/Entity";
import { getEntitiesByRole } from "../../../core/ecs/queries/entities/get";
import { EqSlot } from "../../systems/eq/types";
import { EQ_SLOT_TO_ENTITY } from "../entities/eq/mapping";
import { RingSlotEntity } from "../entities/eq/slots/RingSlotEntity";
import { getContainerItemAt, getContainerItems } from "./containers";

export const getEq = (entity: Entity): Entity[] => {
  return getEntitiesByRole(entity, EntityRole.EQ);
};

export const getEqItems = (entity: Entity) => {
  const eq = getEq(entity);
  const items = eq.flatMap((item) => getContainerItems(item));
  return items;
};

const isRingSlot = (entity: Entity) => {
  return entity.type === RingSlotEntity.type;
};

// TODO: get rid of this shit
export const getEqSlot = (entity: Entity, slot: EqSlot) => {
  const eqSlots = getEq(entity);
  let targetSlot = undefined;
  if (slot === EqSlot.RING1 || slot === EqSlot.RING2) {
    const targetSlots = eqSlots.filter((s) => isRingSlot(s));
    targetSlot = targetSlots[slot === EqSlot.RING1 ? 0 : 1];
  } else {
    targetSlot = getEq(entity).find((s) => {
      const slotEntity = EQ_SLOT_TO_ENTITY.get(slot);
      return slotEntity ? s.type === slotEntity : false;
    });
  }
  if (!targetSlot) {
    throw new Error(`No EQ slot`);
  }
  return targetSlot;
};

export const getEqSlotItem = (entity: Entity, slot: EqSlot) => {
  const eqSlot = getEqSlot(entity, slot);
  return getContainerItemAt(eqSlot, 1);
};

export const getEquippedWeapon = (entity: Entity): Entity | undefined => {
  const slot = getEqSlot(entity, EqSlot.MAIN_HAND);
  return getContainerItemAt(slot, 1);
};
