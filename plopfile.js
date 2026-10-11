import { registerActionResolverGenerators } from "./scripts/plop/generators/action-resolvers.js"
import {
  registerComponentGenerator,
  registerItemFamilyGenerator,
} from "./scripts/plop/generators/model.js"
import { registerMobGenerator } from "./scripts/plop/generators/mob.js"
import { registerItemGenerator } from "./scripts/plop/generators/item.js"
import { registerTestGenerator } from "./scripts/plop/generators/test.js"
import { registerTemplateHelpers } from "./scripts/plop/names.js"

export default function plopfile(plop) {
  registerTemplateHelpers(plop)
  registerTestGenerator(plop)
  registerComponentGenerator(plop)
  registerItemFamilyGenerator(plop)
  registerItemGenerator(plop)
  registerMobGenerator(plop)
  registerActionResolverGenerators(plop)
}
