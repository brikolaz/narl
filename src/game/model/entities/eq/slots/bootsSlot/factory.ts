import type { Entity } from "../../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../../BaseItemFactory"
import { BootsSlotEntity } from "./variants/BootsSlot/BootsSlotEntity"
import { BootsSlotEntityVariants } from "./variants/variants"
class BootsSlotFactory extends BaseItemFactory<BootsSlotEntityVariants> {
  protected getVariants(): readonly BootsSlotEntityVariants[] {
    return BootsSlotEntityVariants
  }

  getDefault(): Entity {
    return BootsSlotEntity()
  }
}

export const BootsSlotEntityFactory = new BootsSlotFactory()
