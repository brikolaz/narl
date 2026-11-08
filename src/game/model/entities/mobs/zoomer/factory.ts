import type { Entity } from "../../../../../core/model/Entity"
import { BaseMobFactory } from "../../../BaseMobFactory"
import { ZoomerEntity } from "./variants/Zoomer/ZoomerEntity"
import { ZoomerEntityVariants } from "./variants/variants"

class ZoomerFactory extends BaseMobFactory<ZoomerEntityVariants> {
  protected getVariants(): readonly ZoomerEntityVariants[] {
    return ZoomerEntityVariants
  }

  getDefault(): Entity {
    return ZoomerEntity()
  }
}

export const ZoomerEntityFactory = new ZoomerFactory()
