import type { EntityType } from "../../../core/ecs/Entity";
import type { Factory } from "../Factory";
import { ITEM_FACTORIES } from "./items/factories";
import { MOB_FACTORIES } from "./mobs/factories";

const factories : Map<EntityType, Factory>[] = [
  ITEM_FACTORIES,
  MOB_FACTORIES,
]

export const getFactory = (type: EntityType) => {
  for (const factory of factories) {
    const target = factory.get(type);
    if (target) {
      return target;
    }
  }

  throw new Error("No entity factory");
};
