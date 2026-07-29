import type { EntityType } from "../../../../core/model/Entity";
import type { MobFactory } from "../../Factory";
import {
  RageBaitEntity,
  RageBaitEntityFactory,
} from "./rageBait/RageBaitEntity";

export const MOB_FACTORIES = new Map<EntityType, MobFactory>([
  [RageBaitEntity.type, RageBaitEntityFactory],
]);
