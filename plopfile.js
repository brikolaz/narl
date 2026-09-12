import { registerActionResolverGenerators } from "./plop/generators/action-resolvers.js";
import {
  registerComponentGenerator,
  registerEntityGenerator,
} from "./plop/generators/model.js";
import { registerMobGenerator } from "./plop/generators/mob.js";
import { registerTestGenerator } from "./plop/generators/test.js";
import { registerTemplateHelpers } from "./plop/names.js";

export default function plopfile(plop) {
  registerTemplateHelpers(plop);
  registerTestGenerator(plop);
  registerComponentGenerator(plop);
  registerEntityGenerator(plop);
  registerMobGenerator(plop);
  registerActionResolverGenerators(plop);
}
