import type { Entity } from "../../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../../BaseItemFactory"
import { HeadSlotEntity } from "./variants/HeadSlot/HeadSlotEntity"
import type { HeadSlotEntityVariants } from "./variants/variants"
class HeadSlotFactory extends BaseItemFactory<HeadSlotEntityVariants> {
  getDefault(): Entity {
    return HeadSlotEntity()
  }
}

export const HeadSlotEntityFactory = new HeadSlotFactory()
