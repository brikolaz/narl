import type { EntityType } from "../../../../core/model/Entity";
import type { MobFactory } from "../../Factory";
import {
  RageBaitEntity,
  RageBaitEntityFactory,
} from "./rageBait/RageBaitEntity";
import { BoomerEntity, BoomerEntityFactory } from "./boomer/BoomerEntity";
import { ZoomerEntity, ZoomerEntityFactory } from "./zoomer/ZoomerEntity";

export const MOB_FACTORIES = new Map<EntityType, MobFactory>([
  [RageBaitEntity.type, RageBaitEntityFactory],
  [ZoomerEntity.type, ZoomerEntityFactory],
  [BoomerEntity.type, BoomerEntityFactory],
]);
