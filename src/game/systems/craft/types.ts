import type { Entity } from "../../../core/model/Entity"
import type { Action } from "../actions/action"

type CraftPlan = {
  recipe: CraftRecipe
  items: Entity[]
}

export type CraftRecipe = (items: Entity[]) => CraftPlan | undefined

export type CraftInstruction = (
  action: Action,
  items: Entity[],
) => Entity | undefined
