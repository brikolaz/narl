import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { ArmorEntity } from "./variants/Armor/ArmorEntity"
import type { ArmorEntityVariants } from "./variants/variants"

class ArmorFactory extends BaseItemFactory<ArmorEntityVariants> {
  getDefault(): Entity {
    return ArmorEntity()
  }
}

export const ArmorEntityFactory = new ArmorFactory()
