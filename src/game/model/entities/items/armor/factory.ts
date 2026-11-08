import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { ArmorEntity } from "./variants/Armor/ArmorEntity"
import { ArmorEntityVariants } from "./variants/variants"

class ArmorFactory extends BaseItemFactory<ArmorEntityVariants> {
  protected getVariants(): readonly ArmorEntityVariants[] {
    return ArmorEntityVariants
  }

  getDefault(): Entity {
    return ArmorEntity()
  }
}

export const ArmorEntityFactory = new ArmorFactory()
