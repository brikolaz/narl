import { Entity, getComponentsByType } from "../../../core/ecs";
import { ItemSlotComponent } from "../../model/components/eq/ItemSlotComponent";

export const getItemSlots = (entity: Entity): ItemSlotComponent[] => {
  return getComponentsByType(entity, ItemSlotComponent);
};
