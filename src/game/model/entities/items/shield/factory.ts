import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { ShieldEntity } from "./variants/Shield/ShieldEntity"
import { ShieldEntityVariants } from "./variants/variants"

class ShieldFactory extends BaseItemFactory<ShieldEntityVariants> {
  protected getVariants(): readonly ShieldEntityVariants[] {
    return ShieldEntityVariants
  }

  getDefault(): Entity {
    return ShieldEntity()
  }
}

export const ShieldEntityFactory = new ShieldFactory()
