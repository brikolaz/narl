import type { Entity } from "../../../core/ecs/Entity";
import { hasComponentsByType } from "../../../core/ecs/queries/components/has";
import { DmgComponent } from "../components/items/DmgComponent";

export const isWeapon = (item: Entity) => {
  return hasComponentsByType(item, DmgComponent);
};
