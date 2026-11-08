import {
  resolveEntityType,
  type EntityTypeArgument,
} from "../../../../../core/model/queries/entities/normalize"
import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { LongSwordEntity } from "./variants/LongSword/LongSwordEntity"
import { SwordEntity } from "./variants/Sword/SwordEntity"
import { SwordEntityVariants } from "./variants/variants"

class SwordFactory extends BaseItemFactory<SwordEntityVariants> {
  protected getVariants(): readonly SwordEntityVariants[] {
    return SwordEntityVariants
  }

  getDefault(): Entity {
    return SwordEntity()
  }
  getVariant(variant: EntityTypeArgument<SwordEntityVariants>): Entity {
    switch (resolveEntityType(variant)) {
      case LongSwordEntity.type:
        return LongSwordEntity()
      default:
        return this.getDefault()
    }
  }
}

export const SwordEntityFactory = new SwordFactory()
