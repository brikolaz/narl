import type { Entity } from "../../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../../BaseItemFactory"
import { ChestSlotEntity } from "./variants/ChestSlot/ChestSlotEntity"
import type { ChestSlotEntityVariants } from "./variants/variants"
class ChestSlotFactory extends BaseItemFactory<ChestSlotEntityVariants> {
  getDefault(): Entity {
    return ChestSlotEntity()
  }
}

export const ChestSlotEntityFactory = new ChestSlotFactory()
