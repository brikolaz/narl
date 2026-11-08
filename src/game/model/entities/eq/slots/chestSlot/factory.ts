import type { Entity } from "../../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../../BaseItemFactory"
import { ChestSlotEntity } from "./variants/ChestSlot/ChestSlotEntity"
import { ChestSlotEntityVariants } from "./variants/variants"
class ChestSlotFactory extends BaseItemFactory<ChestSlotEntityVariants> {
  protected getVariants(): readonly ChestSlotEntityVariants[] {
    return ChestSlotEntityVariants
  }

  getDefault(): Entity {
    return ChestSlotEntity()
  }
}

export const ChestSlotEntityFactory = new ChestSlotFactory()
