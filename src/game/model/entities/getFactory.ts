import type { EntityType } from "../../../core/model/Entity";
import { MOB_FACTORIES } from "./mobs/factories";

export const getMobFactory = (type: EntityType) => {
  const factory = MOB_FACTORIES.get(type);

  if (!factory) {
    throw new Error("No entity factory");

  }
  return factory
};
