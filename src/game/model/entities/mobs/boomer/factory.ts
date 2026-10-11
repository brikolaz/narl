import {
  resolveEntityType,
  type EntityTypeArgument,
} from "../../../../../core/model/queries/entities/normalize"
import type { Entity } from "../../../../../core/model/Entity"
import { patchComponentByType } from "../../../../../core/model/queries/components/patch"
import {
  HostilityEnum,
  HostilityComponent,
} from "../../../components/ai/HostilityComponent"
import { BaseMobFactory } from "../../../BaseMobFactory"
import type { BoomerEntityVariants } from "./variants/variants"
import { BoomerEntity } from "./variants/Boomer/BoomerEntity"
import { BabyBoomerEntity } from "./variants/BabyBoomer/BabyBoomerEntity"

class BoomerFactory extends BaseMobFactory<BoomerEntityVariants> {
  getDefault(): Entity {
    return BoomerEntity()
  }

  getPursuer(variant?: EntityTypeArgument<BoomerEntityVariants>): Entity {
    const boomer = super.getPursuer(variant)
    patchComponentByType(boomer, HostilityComponent, (component) => {
      component.hostility = HostilityEnum.FRIENDLY_HOSTILE
    })
    return boomer
  }

  getVariant(variant: EntityTypeArgument<BoomerEntityVariants>): Entity {
    switch (resolveEntityType(variant)) {
      case BabyBoomerEntity.type:
        return BabyBoomerEntity()
      default:
        return this.getDefault()
    }
  }
}

export const BoomerEntityFactory = new BoomerFactory()
