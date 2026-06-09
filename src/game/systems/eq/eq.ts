import type { Entity } from "../../../core/ecs/Entity";
import { hasComponentByType } from "../../../core/ecs/queries/component";
import {
  getEntitiesByType,
  getEntityByType,
} from "../../../core/ecs/queries/entities";
import { PlaceholderComponent } from "../../model/components/PlaceholderComponent";
import { EqEntity } from "../../model/entities/eq/EqEntity";
import { EqSlotEntity } from "../../model/entities/eq/EqSlotEntity";
import { ItemEntity } from "../../model/entities/items/ItemEntity";
import { getWeaponDmg } from "../attack/dmg";
import type { EqSlot } from "./types";

export const getEq = (entity: Entity): EqEntity | undefined => {
  return getEntityByType(entity, EqEntity);
};

export const getEqSlots = (entity: Entity) => {
  const eq = getEq(entity);
  return getEntitiesByType(eq, EqSlotEntity);
};

export const getEqSlotAt = (entity: Entity, slot: EqSlot) => {
  return getEqSlots(entity)[slot - 1];
};

export const getEquippedWeaponDamage = (weapon: ItemEntity) => {
  const dmg = getWeaponDmg(weapon);
  return dmg;
};

export const getItemAtEqSlot = (entity: Entity, eqSlotIndex: EqSlot) => {
  const slot = getEqSlotAt(entity, eqSlotIndex);
  const item = getEntityByType(slot, ItemEntity);
  if (item && hasComponentByType(item, PlaceholderComponent)) {
    return undefined;
  }
  return item;
};

export const getEquippedWeapon = (entity: Entity): ItemEntity | undefined => {
  const weapon = getItemAtEqSlot(entity, 1); // hardcoded for now
  return weapon;
};
