import type { Entity } from "../../../../../core/model/Entity"
import {
  resolveEntityType,
  type EntityTypeArgument,
} from "../../../../../core/model/queries/entities/normalize"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { DefensiveRingEntity } from "./variants/DefensiveRing/DefensiveRingEntity"
import { OffensiveRingEntity } from "./variants/OffensiveRing/OffensiveRingEntity"
import { RingEntityVariants } from "./variants/variants"

class RingFactory extends BaseItemFactory<RingEntityVariants> {
  protected getVariants(): readonly RingEntityVariants[] {
    return RingEntityVariants
  }

  getDefault(): Entity {
    return OffensiveRingEntity()
  }
  getVariant(variant: EntityTypeArgument<RingEntityVariants>): Entity {
    switch (resolveEntityType(variant)) {
      case OffensiveRingEntity.type:
        return OffensiveRingEntity()
      case DefensiveRingEntity.type:
        return DefensiveRingEntity()
      default:
        return this.getDefault()
    }
  }
}

export const RingEntityFactory = new RingFactory()
