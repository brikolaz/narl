import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { DickEntity } from "./variants/Dick/DickEntity"
import type { DickEntityVariants } from "./variants/variants"
class DickFactory extends BaseItemFactory<DickEntityVariants> {
  getDefault(): Entity {
    return DickEntity()
  }
}

export const DickEntityFactory = new DickFactory()
