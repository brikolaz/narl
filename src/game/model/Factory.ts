import type { Entity, EntityType } from "../../core/model/Entity"

export interface Factory<Variants extends EntityType = EntityType> {
  getDefault(): Entity
  getVariant?(variant: Variants): Entity
}

export interface ItemFactory<
  Variants extends EntityType = EntityType,
> extends Factory<Variants> {
  setDroppable?: (entity: Entity) => void
}

export interface MobFactory<
  Variants extends EntityType = EntityType,
> extends Required<Factory<Variants>> {
  getPursuer(variant?: Variants): Entity
}
