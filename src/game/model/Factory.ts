import type { Entity } from "../../core/model/Entity"
import type { Enum } from "../../utils/types/Enum"

export interface Factory<Variants extends Enum = Enum> {
  getDefault(): Entity
  getVariant?(variant: Variants[keyof Variants]): Entity
}

export interface ItemFactory extends Factory {
  setDroppable?: (entity: Entity) => void
}

export interface MobFactory extends Factory {
  getPursuer(): Entity
}
