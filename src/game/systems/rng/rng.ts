import type { Entity } from "../../../core/model/Entity"
import type { Random } from "./random"

export type RNG = Random

export const getRng = (entity: Entity) => {
  return entity.rng
}
