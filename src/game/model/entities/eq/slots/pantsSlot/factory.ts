import type { Entity } from "../../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../../BaseItemFactory"
import { PantsSlotEntity } from "./variants/PantsSlot/PantsSlotEntity"
import { PantsSlotEntityVariants } from "./variants/variants"
class PantsSlotFactory extends BaseItemFactory<PantsSlotEntityVariants> {
  protected getVariants(): readonly PantsSlotEntityVariants[] {
    return PantsSlotEntityVariants
  }

  getDefault(): Entity {
    return PantsSlotEntity()
  }
}

export const PantsSlotEntityFactory = new PantsSlotFactory()
