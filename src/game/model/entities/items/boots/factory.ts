import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { BootsEntity } from "./variants/Boots/BootsEntity"
import { BootsEntityVariants } from "./variants/variants"

class BootsFactory extends BaseItemFactory<BootsEntityVariants> {
  protected getVariants(): readonly BootsEntityVariants[] {
    return BootsEntityVariants
  }

  getDefault(): Entity {
    return BootsEntity()
  }
}

export const BootsEntityFactory = new BootsFactory()
