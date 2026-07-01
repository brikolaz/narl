import type { Entity } from "../../../core/ecs/Entity";
import {
  getComponentsByType,
  hasComponentByType,
} from "../../../core/ecs/queries/component";
import { ItemSlotComponent } from "../components/eq/ItemSlotComponent";
import { RemovableComponent } from "../components/eq/RemovableComponent";

export const getItemSlots = (entity: Entity): ItemSlotComponent[] => {
  return getComponentsByType(entity, ItemSlotComponent);
};

export const isRemovable = (entity: Entity) => {
  return hasComponentByType(entity, RemovableComponent);
};