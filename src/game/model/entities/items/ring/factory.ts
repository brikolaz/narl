import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { RingEntity } from "./variants/Ring/RingEntity"
import type { RingEntityVariants } from "./variants/variants"
class RingFactory extends BaseItemFactory<RingEntityVariants> {
  getDefault(): Entity {
    return RingEntity()
  }
}

export const RingEntityFactory = new RingFactory()
