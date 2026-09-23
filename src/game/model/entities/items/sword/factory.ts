import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { LongSwordEntity } from "./variants/LongSword/LongSwordEntity"
import { SwordEntity } from "./variants/Sword/SwordEntity"
import type { SwordEntityVariants } from "./variants/variants"

class SwordFactory extends BaseItemFactory<SwordEntityVariants> {
  getDefault(): Entity {
    return SwordEntity()
  }
  getVariant(variant: SwordEntityVariants): Entity {
    switch (variant) {
      case LongSwordEntity.type:
        return LongSwordEntity()
      default:
        return this.getDefault()
    }
  }
}

export const SwordEntityFactory = new SwordFactory()
