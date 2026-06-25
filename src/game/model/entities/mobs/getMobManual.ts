import type { Constructor } from "../../../../core/ecs/Constructor";
import type { Manual } from "../../Manual";
import type { MobEntity } from "./MobEntity";
import { RageBaitEntity } from "./rageBait/RageBaitEntity";
import { RageBaitEntityManual } from "./rageBait/RageBaitEntityManual";

type MobClass = Constructor<MobEntity>;

const MOB_MANUAL = new Map<MobClass, Manual<MobEntity>>([
  [RageBaitEntity, RageBaitEntityManual],
]);

export const getMobManual = (mob: MobEntity) => {
  const factory = MOB_MANUAL.get(mob.constructor as MobClass);

  return factory;
};
