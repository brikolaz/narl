import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { PantsEntity } from "./variants/Pants/PantsEntity"
import { PantsEntityVariants } from "./variants/variants"

class PantsFactory extends BaseItemFactory<PantsEntityVariants> {
  protected getVariants(): readonly PantsEntityVariants[] {
    return PantsEntityVariants
  }

  getDefault(): Entity {
    return PantsEntity()
  }
}

export const PantsEntityFactory = new PantsFactory()
