import { hasComponentsByType } from "../../../../core/model/queries/components/has"
import { ThreadComponent } from "../../../model/components/containers/ThreadComponent"
import { isContainer } from "../../containers/containers"
import { getIngredientPairs } from "../getIngredientPairs"
import type { CraftRecipe } from "../types"

export const lordOfTheRingsRecipe: CraftRecipe = (items) => {
  if (items.length !== 2) return undefined
  const [first, second] = items

  const ingredients = getIngredientPairs(first, second).find(
    ([, target]) =>
      hasComponentsByType(target, ThreadComponent) && isContainer(target),
  )
  if (!ingredients) return undefined

  const [item, container] = ingredients
  return { recipe: lordOfTheRingsRecipe, items: [item, container] }
}
