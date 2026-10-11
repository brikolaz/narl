import type { EntityTypeArgument } from "../../core/model/queries/entities/normalize"
import type { Entity, EntityType } from "../../core/model/Entity"
import { makePursuer } from "../systems/pursuer/makePursuer"
import type { MobFactory } from "./Factory"

export abstract class BaseMobFactory<
  Variants extends EntityType,
> implements MobFactory<Variants> {
  abstract getDefault(): Entity

  getVariant(variant: EntityTypeArgument<Variants>): Entity {
    void variant
    return this.getDefault()
  }

  getPursuer(variant?: EntityTypeArgument<Variants>): Entity {
    const entity = variant ? this.getVariant(variant) : this.getDefault()
    makePursuer(entity)
    return entity
  }
}
