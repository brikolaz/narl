import { createLordOfTheRings } from "./instructions/createLordOfTheRings"
import { fillContainer } from "./instructions/fillContainer"
import { fillContainerRecipe } from "./recipiec/fillContainerRecipe"
import { lordOfTheRingsRecipe } from "./recipiec/lordOfTheRingsRecipe"
import type { CraftInstruction, CraftRecipe } from "./types"

export const CRAFT_RECIPES = new Map<CraftRecipe, CraftInstruction>([
  [lordOfTheRingsRecipe, createLordOfTheRings],
  [fillContainerRecipe, fillContainer],
])
