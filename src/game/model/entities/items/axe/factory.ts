import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { AxeEntity } from "./variants/Axe/AxeEntity"
import { AxeEntityVariants } from "./variants/variants"

class AxeFactory extends BaseItemFactory<AxeEntityVariants> {
  protected getVariants(): readonly AxeEntityVariants[] {
    return AxeEntityVariants
  }

  getDefault(): Entity {
    return AxeEntity()
  }
}

export const AxeEntityFactory = new AxeFactory()
