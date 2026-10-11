import type { EntityTypeArgument } from "../../core/model/queries/entities/normalize"
import type { Entity, EntityType } from "../../core/model/Entity"
import type { ItemFactory } from "./Factory"

export abstract class BaseItemFactory<
  Variants extends EntityType,
> implements ItemFactory<Variants> {
  abstract getDefault(): Entity

  getVariant(variant: EntityTypeArgument<Variants>): Entity {
    void variant
    return this.getDefault()
  }
}
