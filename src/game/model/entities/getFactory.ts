import { MOB_FACTORIES, type MobEntityVariants } from "./mobs/factories"

export const getMobFactory = (type: MobEntityVariants) => {
  const factory = MOB_FACTORIES.get(type)

  if (!factory) {
    throw new Error("No mob factory")
  }
  return factory
}
