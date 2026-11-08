import type { Entity } from "../../../core/model/Entity"

export const getIngredientPairs = (first: Entity, second: Entity) => {
  return [
    [first, second],
    [second, first],
  ] as const
}
