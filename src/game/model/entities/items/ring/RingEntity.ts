import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../core/model/queries/components/add"
import { upsertRoleEntities } from "../../../../../core/model/queries/entities/add"
import { getRng } from "../../../../systems/rng/rng"
import { GlyphComponent } from "../../../components/display/GlyphComponent"
import { NameComponent } from "../../../components/display/NameComponent"
import { PantsComponent } from "../../../components/equipment/PantsComponent"
import { RemovableComponent } from "../../../components/equipment/RemovableComponent"
import { RingComponent } from "../../../components/equipment/RingComponent"
import { DmgModComponent } from "../../../components/combat/DmgModComponent"
import { DroppableComponent } from "../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../components/interaction/PickupableComponent"
import type { ItemFactory } from "../../../Factory"
import { BonusStatsEntityFactory } from "../../BonusStatsEntity"
import { COLORS } from "../../../../../utils/colors"
import { ColorComponent } from "../../../components/display/ColorComponent"

export const RingEntity = getEntityCreator("RING")
export type RingEntityVariants = typeof RingEntity.type

const addBonusStats = (entity: Entity) => {
  const bonusStats = BonusStatsEntityFactory.getDefault()

  upsertComponents(
    bonusStats,
    DmgModComponent({
      dmgMod: getRng(entity).pick(1.5, 2) ?? DmgModComponent.defaults.dmgMod,
    }),
  )
  upsertRoleEntities(entity, {
    [EntityRoleEnum.BONUS_STATS]: bonusStats,
  })
}

export const RingEntityFactory: ItemFactory<RingEntityVariants> = {
  getDefault: () => {
    const ring = RingEntity()

    upsertComponents(
      ring,
      GlyphComponent({ glyph: "o" }),
      NameComponent({ name: "Ring" }),
      RemovableComponent(),
      RingComponent(),
      PantsComponent(),
      PickupableComponent(),
      DroppableComponent(),
      ColorComponent({ color: COLORS.tier.common }),
    )

    addBonusStats(ring)
    return ring
  },
}
