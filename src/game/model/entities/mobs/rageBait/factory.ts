import type { Entity } from "../../../../../core/model/Entity"
import { BaseMobFactory } from "../../../BaseMobFactory"
import { RageBaitEntity } from "./variants/RageBait/RageBaitEntity"
import type { RageBaitEntityVariants } from "./variants/variants"

class RageBaitFactory extends BaseMobFactory<RageBaitEntityVariants> {
  getDefault(): Entity {
    return RageBaitEntity()
  }
}

export const RageBaitEntityFactory = new RageBaitFactory()
