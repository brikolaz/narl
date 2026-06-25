import type { Constructor } from "../../../../core/ecs/Constructor";
import type { Factory } from "../../Factory";
import type { MobEntity } from "./MobEntity";
import {
  RageBaitEntity,
} from "./rageBait/RageBaitEntity";
import { RageBaitEntityFactory } from "./rageBait/RageBaitEntityFactory";

type MobClass = Constructor<MobEntity>;

const MOB_FACTORY = new Map<MobClass, Factory<MobEntity>>([
  [RageBaitEntity, RageBaitEntityFactory],
]);

export const getMobFactory = (mobClass: MobClass) => {
  const factory = MOB_FACTORY.get(mobClass);

  if (!factory) {
    throw new Error("Unknown mob class");
  }

  return factory;
};
