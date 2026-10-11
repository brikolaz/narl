import type { EntityTypeArgument } from "../../core/model/queries/entities/normalize"
import type { Entity, EntityType } from "../../core/model/Entity"

export interface Factory<Variants extends EntityType = EntityType> {
  getDefault(): Entity
  getVariant?(variant: EntityTypeArgument<Variants>): Entity
}

export type ItemFactory<Variants extends EntityType = EntityType> = Required<
  Factory<Variants>
>

export interface MobFactory<
  Variants extends EntityType = EntityType,
> extends Required<Factory<Variants>> {
  getPursuer(variant?: EntityTypeArgument<Variants>): Entity
}
