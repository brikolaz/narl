import { EntityRole, type Entity } from "../../../core/ecs/Entity";
import { hasComponentsByType } from "../../../core/ecs/queries/components/has";
import { getEntitiesByRole } from "../../../core/ecs/queries/entities/get";
import { RemovableComponent } from "../components/eq/RemovableComponent";

export const getItemSlots = (entity: Entity): Entity[] => {
  return getEntitiesByRole(entity, EntityRole.ITEM);
};

export const isRemovable = (entity: Entity): boolean => {
  return hasComponentsByType(entity, RemovableComponent);
};
