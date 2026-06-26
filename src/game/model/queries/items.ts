import type { Entity } from "../../../core/ecs/Entity";
import { getComponentsByType } from "../../../core/ecs/queries/component";
import { ItemSlotComponent } from "../components/eq/ItemSlotComponent";

export const getItemSlots = (entity: Entity): ItemSlotComponent[] => {
  return getComponentsByType(entity, ItemSlotComponent);
};

