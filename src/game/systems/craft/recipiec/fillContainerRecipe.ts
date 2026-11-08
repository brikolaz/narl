import {
  getMaxNestDepth,
  getNestDepth,
  isContainer,
  isContainerFull,
} from "../../containers/containers"
import { getIngredientPairs } from "../getIngredientPairs"
import type { CraftRecipe } from "../types"

export const fillContainerRecipe: CraftRecipe = (items) => {
  if (items.length !== 2) {
    return undefined
  }
  const [first, second] = items

  const targets = getIngredientPairs(first, second).filter(([, target]) =>
    isContainer(target),
  )
  if (!targets.length) {
    return undefined
  }

  const [item, container] =
    targets.find(
      ([item, container]) =>
        !isContainerFull(container) &&
        (!isContainer(item) ||
          getNestDepth(item) + 1 <= getMaxNestDepth(container)),
    ) ?? targets[0]
  return { recipe: fillContainerRecipe, items: [item, container] }
}
