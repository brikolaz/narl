import type { MobFactory } from "../../Factory"
import { RageBaitEntityFactory } from "./rageBait/factory"
import type { RageBaitEntityVariants } from "./rageBait/variants/variants"
import { RageBaitEntity } from "./rageBait/variants/RageBait/RageBaitEntity"
import { BoomerEntityFactory } from "./boomer/factory"
import type { BoomerEntityVariants } from "./boomer/variants/variants"
import { BoomerEntity } from "./boomer/variants/Boomer/BoomerEntity"
import { ZoomerEntityFactory } from "./zoomer/factory"
import type { ZoomerEntityVariants } from "./zoomer/variants/variants"
import { ZoomerEntity } from "./zoomer/variants/Zoomer/ZoomerEntity"
import { BabyBoomerEntity } from "./boomer/variants/BabyBoomer/BabyBoomerEntity"

export type MobEntityVariants =
  RageBaitEntityVariants | ZoomerEntityVariants | BoomerEntityVariants

export const MOB_FACTORIES = new Map<MobEntityVariants, MobFactory>([
  [RageBaitEntity.type, RageBaitEntityFactory],
  [ZoomerEntity.type, ZoomerEntityFactory],
  [BoomerEntity.type, BoomerEntityFactory],
  [BabyBoomerEntity.type, BoomerEntityFactory],
])
