import {
  resolveEntityType,
  type EntityTypeArgument,
} from "../../../core/model/queries/entities/normalize"
import { ITEM_FACTORIES, type ItemEntityVariants } from "./items/factories"
import { MOB_FACTORIES, type MobEntityVariants } from "./mobs/factories"

export const getMobFactory = (type: EntityTypeArgument<MobEntityVariants>) => {
  const factory = MOB_FACTORIES.get(resolveEntityType(type))

  if (!factory) {
    throw new Error("No mob factory")
  }
  return factory
}

export const getItemFactory = (
  type: EntityTypeArgument<ItemEntityVariants>,
) => {
  const factory = ITEM_FACTORIES.get(resolveEntityType(type))

  if (!factory) {
    throw new Error("No item factory")
  }
  return factory
}
