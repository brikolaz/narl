import type { Entity } from "../../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../../BaseItemFactory"
import { OffhandSlotEntity } from "./variants/OffhandSlot/OffhandSlotEntity"
import type { OffhandSlotEntityVariants } from "./variants/variants"
class OffhandSlotFactory extends BaseItemFactory<OffhandSlotEntityVariants> {
  getDefault(): Entity {
    return OffhandSlotEntity()
  }
}

export const OffhandSlotEntityFactory = new OffhandSlotFactory()
