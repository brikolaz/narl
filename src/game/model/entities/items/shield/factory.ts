import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { ShieldEntity } from "./variants/Shield/ShieldEntity"
import type { ShieldEntityVariants } from "./variants/variants"

class ShieldFactory extends BaseItemFactory<ShieldEntityVariants> {
  getDefault(): Entity {
    return ShieldEntity()
  }
}

export const ShieldEntityFactory = new ShieldFactory()
