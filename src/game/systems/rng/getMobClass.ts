import type { ConcreteConstructor } from "../../../core/ecs/Constructor";
import type { MobEntity } from "../../model/entities/mobs/MobEntity";
import {
    RAGE_BAIT_NAME,
    RageBaitEntity,
} from "../../model/entities/mobs/RageBait";

export const getMobClass = (mobName: string): ConcreteConstructor<MobEntity> => {
  switch (mobName) {
    case RAGE_BAIT_NAME:
      return RageBaitEntity;
    default:
      throw new Error(`Unknown mob name`);
  }
};
