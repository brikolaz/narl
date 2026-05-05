import {
  Entity,
  getComponentByType,
  getEntitiesByType,
  getEntityByType,
  removeEntityById,
} from "../../../core/ecs";
import { EqSlotEntity } from "../../model/entities/eq/EqSlotEntity";
import { EqEntity } from "../../model/entities/eq/EqEntity";
import { ItemEntity } from "../../model";
import { DmgComponent } from "../../model/components/DmgComponent";

export const getEq = (entity: Entity): EqEntity | undefined => {
  return getEntityByType(entity, EqEntity);
};

export const getEqSlots = (entity: Entity) => {
  const eq = getEq(entity);
  return getEntitiesByType(eq, EqSlotEntity);
};

export const getEquippedWeapon = (entity: Entity) => {
  const eq = getEq(entity);
  const slot = getEntitiesByType(eq, EqSlotEntity)[0];
  const weapon = getEntitiesByType(slot, ItemEntity)[0];
  return weapon;
};

export const getEquippedWeaponDamage = (weapon: ItemEntity) => {
  const dmg = getComponentByType(weapon, DmgComponent)?.dmg;
  if (dmg === undefined) {
    throw new Error(`Equiped weapon does not have a DmgComponent`);
  }
  return dmg;
};

export const unequipWeapon = (entity: Entity, index: number) => {
  const slots = getEqSlots(entity);
  const slot = slots[index];
  const weapon = getEntityByType(slot, ItemEntity);
  if (weapon) {
    removeEntityById(slot, weapon.id);
  }
  return weapon;
};
