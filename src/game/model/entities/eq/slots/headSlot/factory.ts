import type { Entity } from "../../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../../BaseItemFactory"
import { HeadSlotEntity } from "./variants/HeadSlot/HeadSlotEntity"
import { HeadSlotEntityVariants } from "./variants/variants"
class HeadSlotFactory extends BaseItemFactory<HeadSlotEntityVariants> {
  protected getVariants(): readonly HeadSlotEntityVariants[] {
    return HeadSlotEntityVariants
  }

  getDefault(): Entity {
    return HeadSlotEntity()
  }
}

export const HeadSlotEntityFactory = new HeadSlotFactory()
