import type { Entity } from "../../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../../BaseItemFactory"
import { OffhandSlotEntity } from "./variants/OffhandSlot/OffhandSlotEntity"
import { OffhandSlotEntityVariants } from "./variants/variants"
class OffhandSlotFactory extends BaseItemFactory<OffhandSlotEntityVariants> {
  protected getVariants(): readonly OffhandSlotEntityVariants[] {
    return OffhandSlotEntityVariants
  }

  getDefault(): Entity {
    return OffhandSlotEntity()
  }
}

export const OffhandSlotEntityFactory = new OffhandSlotFactory()
