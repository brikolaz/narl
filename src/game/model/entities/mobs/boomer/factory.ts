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

  getPursuer(variant?: BoomerEntityVariants): Entity {
    const boomer = super.getPursuer(variant)
    patchComponentByType(boomer, HostilityComponent, (component) => {
      component.hostility = HostilityEnum.FRIENDLY_HOSTILE
    })
    return boomer
  }

  getVariant(variant: BoomerEntityVariants): Entity {
    switch (variant) {
      case BabyBoomerEntity.type:
        return BabyBoomerEntity()
      default:
        return this.getDefault()
    }
  }
}

export const BoomerEntityFactory = new BoomerFactory()
