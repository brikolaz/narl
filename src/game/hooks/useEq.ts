import { Entity } from "../../core/ecs/Entity";
import { getEntityByType } from "../../core/ecs/queries/entities";
import  { EqSlotEntity } from "../model/entities/eq/EqSlotEntity";
import { ItemEntity } from "../model/entities/items/ItemEntity";
import { getEqSlots } from "../systems/eq/eq";


export type Eq = {
  eqSlots: EqSlotEntity[];
  getItemInSlot: (slot: EqSlotEntity) => ItemEntity | undefined;
};

export const useEq = (entity: Entity): Eq => {
  const eqSlots = getEqSlots(entity);
  console.log(eqSlots)
  const getItemInSlot = (slot: EqSlotEntity) => {
    return getEntityByType(slot, ItemEntity);
  };

  return { eqSlots, getItemInSlot };
};
