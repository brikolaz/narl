import { registerActionResolverGenerators } from "./scripts/plop/generators/action-resolvers.js"
import {
  registerComponentGenerator,
  registerEntityGenerator,
} from "./scripts/plop/generators/model.js"
import { registerMobGenerator } from "./scripts/plop/generators/mob.js"
import { registerTestGenerator } from "./scripts/plop/generators/test.js"
import { registerTemplateHelpers } from "./scripts/plop/names.js"

export default function plopfile(plop) {
  registerTemplateHelpers(plop)
  registerTestGenerator(plop)
  registerComponentGenerator(plop)
  registerEntityGenerator(plop)
  registerMobGenerator(plop)
  registerActionResolverGenerators(plop)
}
