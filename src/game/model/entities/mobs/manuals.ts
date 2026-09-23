import type { EntityType } from "../../../../core/model/Entity"
import type { Manual } from "../../Manual"
import { BabyBoomerEntity } from "./boomer/variants/BabyBoomer/BabyBoomerEntity"
import { BabyBoomerEntityManual } from "./boomer/variants/BabyBoomer/BabyBoomerEntityManual"
import { BoomerEntity } from "./boomer/variants/Boomer/BoomerEntity"
import { BoomerEntityManual } from "./boomer/variants/Boomer/BoomerEntityManual"
import { RageBaitEntity } from "./rageBait/variants/RageBait/RageBaitEntity"
import { RageBaitEntityManual } from "./rageBait/variants/RageBait/RageBaitEntityManual"
import { ZoomerEntity } from "./zoomer/variants/Zoomer/ZoomerEntity"
import { ZoomerEntityManual } from "./zoomer/variants/Zoomer/ZoomerEntityManual"

export const MOB_MANUALS = new Map<EntityType, Manual>([
  [RageBaitEntity.type, RageBaitEntityManual],
  [ZoomerEntity.type, ZoomerEntityManual],
  [BoomerEntity.type, BoomerEntityManual],
  [BabyBoomerEntity.type, BabyBoomerEntityManual],
])
