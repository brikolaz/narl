import {
  resolveEntityType,
  type EntityTypeArgument,
} from "../../../../../core/model/queries/entities/normalize"
import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { HelmetEntity } from "./variants/Helmet/HelmetEntity"
import { HornedHelmetEntity } from "./variants/HornedHelmet/HornedHelmetEntity"
import type { HelmetEntityVariants } from "./variants/variants"

class HelmetFactory extends BaseItemFactory<HelmetEntityVariants> {
  getDefault(): Entity {
    return HelmetEntity()
  }
  getVariant(variant: EntityTypeArgument<HelmetEntityVariants>): Entity {
    switch (resolveEntityType(variant)) {
      case HornedHelmetEntity.type:
        return HornedHelmetEntity()
      default:
        return this.getDefault()
    }
  }
}

export const HelmetEntityFactory = new HelmetFactory()
