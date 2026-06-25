import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/component";
import {
  getEntitiesByType,
  getEntityByType,
} from "../../../core/ecs/queries/entities";
import type { EqSlot } from "../../systems/eq/types";
import { NameComponent } from "../components/display/NameComponent";
import { EqEntity } from "../entities/eq/EqEntity";
import { EqSlotEntity } from "../entities/eq/EqSlotEntity";
import type { ItemEntity } from "../entities/items/ItemEntity";
import {
  getContainerItemAt,
  getContainerItems,
} from "./containers";

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
  const slot = getEqSlotAt(entity, 1);
  return getContainerItemAt(slot, 1);
};

export const getEqSlotName = (entity: Entity, slot: EqSlot) => {
  const eqSlot = getEqSlots(entity)[slot - 1];
  const name = getComponentByType(eqSlot, NameComponent)?.name;
  return name;
};
