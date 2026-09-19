import type { MobFactory } from "../../Factory"
import {
  RageBaitEntity,
  RageBaitEntityFactory,
  type RageBaitEntityVariants,
} from "./rageBait/RageBaitEntity"
import {
  BoomerEntity,
  BoomerEntityFactory,
  type BoomerEntityVariants,
} from "./boomer/BoomerEntity"
import {
  ZoomerEntity,
  ZoomerEntityFactory,
  type ZoomerEntityVariants,
} from "./zoomer/ZoomerEntity"

export type MobEntityVariants =
  RageBaitEntityVariants | ZoomerEntityVariants | BoomerEntityVariants

export const MOB_FACTORIES = new Map<MobEntityVariants, MobFactory>([
  [RageBaitEntity.type, RageBaitEntityFactory],
  [ZoomerEntity.type, ZoomerEntityFactory],
  [BoomerEntity.type, BoomerEntityFactory],
])
