import type { Entity, EntityType } from "../../../core/model/Entity";
import type { Manual } from "../Manual";
import { EQ_SLOTS_MANUALS } from "./eq/slots/manuals";
import { ITEM_MANUALS } from "./items/manuals";
import { MOB_MANUALS } from "./mobs/manuals";

const manuals: Map<EntityType, Manual<Entity>>[] = [
  MOB_MANUALS,
  ITEM_MANUALS,
  EQ_SLOTS_MANUALS,
];

export const getManual = (entity: Entity | undefined) => {
  if (!entity) {
    return undefined;
  }
  for (const manual of manuals) {
    const target = manual.get(entity.type);
    if (target) {
      return target;
    }
  }
};
