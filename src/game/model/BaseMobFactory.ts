import { STATE } from "../state"
import type { EntityTypeArgument } from "../../core/model/queries/entities/normalize"
import type { Entity, EntityType } from "../../core/model/Entity"
import { makePursuer } from "../systems/pursuer/makePursuer"
import type { MobFactory } from "./Factory"

export abstract class BaseMobFactory<
  Variants extends EntityType,
> implements MobFactory<Variants> {
  abstract getDefault(): Entity

  protected abstract getVariants(): readonly Variants[]

  getRandomVariant(): Entity {
    const variant = STATE.rng.mobs.pick(...this.getVariants())
    return variant === undefined ? this.getDefault() : this.getVariant(variant)
  }

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
