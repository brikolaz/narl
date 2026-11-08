import type { Entity } from "../../../../../core/model/Entity"
import { BaseMobFactory } from "../../../BaseMobFactory"
import { RageBaitEntity } from "./variants/RageBait/RageBaitEntity"
import { RageBaitEntityVariants } from "./variants/variants"

class RageBaitFactory extends BaseMobFactory<RageBaitEntityVariants> {
  protected getVariants(): readonly RageBaitEntityVariants[] {
    return RageBaitEntityVariants
  }

  getDefault(): Entity {
    return RageBaitEntity()
  }
}

export const RageBaitEntityFactory = new RageBaitFactory()
