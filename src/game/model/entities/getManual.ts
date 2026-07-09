import type { Entity, EntityType } from "../../../core/ecs/Entity";
import type { Manual } from "../Manual";
import { ITEM_MANUALS } from "./items/manuals";
import { MOB_MANUALS } from "./mobs/manuals";

const manuals: Map<EntityType, Manual<Entity>>[] = [MOB_MANUALS, ITEM_MANUALS];

export const getManual = (entity: Entity) => {
  for (const manual of manuals) {
    const target = manual.get(entity.type);
    if (target) {
      return target;
    }
  }
};
