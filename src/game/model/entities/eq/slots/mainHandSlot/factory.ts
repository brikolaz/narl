import type { Entity } from "../../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../../BaseItemFactory"
import { MainHandSlotEntity } from "./variants/MainHandSlot/MainHandSlotEntity"
import type { MainHandSlotEntityVariants } from "./variants/variants"
class MainHandSlotFactory extends BaseItemFactory<MainHandSlotEntityVariants> {
  getDefault(): Entity {
    return MainHandSlotEntity()
  }
}

export const MainHandSlotEntityFactory = new MainHandSlotFactory()
