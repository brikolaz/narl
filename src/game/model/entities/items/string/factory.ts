import type { Entity } from "../../../../../core/model/Entity"
import {
  resolveEntityType,
  type EntityTypeArgument,
} from "../../../../../core/model/queries/entities/normalize"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { DefensiveStringEntity } from "./variants/DefensiveString/DefensiveStringEntity"
import { OffensiveStringEntity } from "./variants/OffensiveString/OffensiveStringEntity"
import { StringEntityVariants } from "./variants/variants"

class StringFactory extends BaseItemFactory<StringEntityVariants> {
  protected getVariants(): readonly StringEntityVariants[] {
    return StringEntityVariants
  }

  getDefault(): Entity {
    return OffensiveStringEntity()
  }
  getVariant(variant: EntityTypeArgument<StringEntityVariants>): Entity {
    switch (resolveEntityType(variant)) {
      case OffensiveStringEntity.type:
        return OffensiveStringEntity()
      case DefensiveStringEntity.type:
        return DefensiveStringEntity()
      default:
        return this.getDefault()
    }
  }
}

export const StringEntityFactory = new StringFactory()
