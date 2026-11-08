import { STATE } from "../state"
import type { EntityTypeArgument } from "../../core/model/queries/entities/normalize"
import type { Entity, EntityType } from "../../core/model/Entity"
import type { ItemFactory } from "./Factory"

export abstract class BaseItemFactory<
  Variants extends EntityType,
> implements ItemFactory<Variants> {
  abstract getDefault(): Entity

  protected abstract getVariants(): readonly Variants[]

  getRandomVariant(): Entity {
    const variant = STATE.rng.items.pick(...this.getVariants())
    return variant === undefined ? this.getDefault() : this.getVariant(variant)
  }

  getVariant(variant: EntityTypeArgument<Variants>): Entity {
    void variant
    return this.getDefault()
  }
}
