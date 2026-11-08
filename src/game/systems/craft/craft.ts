import type { Entity } from "../../../core/model/Entity"
import type { Action } from "../actions/action"
import { getEntityName } from "../inspect/getEntityName"
import { CRAFT_RECIPES } from "./recipes"

export const craft = (action: Action, items: Entity[]): void => {
  const ingredients = items.toSorted((first, second) => first.id - second.id)
  for (const [recipe, instruction] of CRAFT_RECIPES) {
    const plan = recipe(ingredients)
    if (!plan) continue

    const assembledItem = instruction(action, plan.items)
    if (assembledItem) {
      action.success("ITEM.COMBINED", getEntityName(assembledItem))
    }
    return
  }
  action.fail("ITEM.CANNOT_COMBINE")
}
