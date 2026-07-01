import type { Entity } from "../../../core/ecs/Entity";
import {
  getEntitiesByType,
  getEntityByType,
} from "../../../core/ecs/queries/entities";
import { EqEntity } from "../entities/eq/EqEntity";
import { EqSlotEntity } from "../entities/eq/EqSlotEntity";
import type { ItemEntity } from "../entities/items/ItemEntity";
import { getContainerItemAt, getContainerItems } from "./containers";
import { EqSlot } from "../../systems/eq/types";

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

export const getEqSlotAt = (entity: Entity, slot: EqSlot) => {
  return getEqSlots(entity)[slot - 1];
};

export const getEquippedWeapon = (entity: Entity): ItemEntity | undefined => {
  const slot = getEqSlotAt(entity, EqSlot.MAIN_HAND);
  return getContainerItemAt(slot, 1);
};
