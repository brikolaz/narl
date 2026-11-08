import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { upsertRoleEntities } from "../../../../../../../core/model/queries/entities/add"
import { COLORS } from "../../../../../../../core/utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { DmgMulComponent } from "../../../../../components/combat/DmgMulComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { PantsComponent } from "../../../../../components/equipment/PantsComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { RingComponent } from "../../../../../components/equipment/RingComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"
import { SeveringCurseComponent } from "../../../../../components/curse/SeveringCurseComponent"
import { BonusStatsEntityFactory } from "../../../../bonusStats/factory"

const addComponents = (offensiveRing: Entity<"OFFENSIVE_RING">): void => {
  upsertComponents(
    offensiveRing,
    GlyphComponent({ glyph: "o" }),
    NameComponent({ name: "ENTITY.OFFENSIVE_RING" }),
    RemovableComponent(),
    RingComponent(),
    PantsComponent(),
    PickupableComponent(),
    DroppableComponent(),
    ColorComponent({ color: COLORS.tier.common }),
  )

  if (getRng(offensiveRing).namedChance(80, "SEVERING_CURSE")) {
    upsertComponents(offensiveRing, SeveringCurseComponent())
  }
}
const addLoot = (offensiveRing: Entity<"OFFENSIVE_RING">): void => {
  void offensiveRing
}

const addEntities = (offensiveRing: Entity<"OFFENSIVE_RING">): void => {
  const bonusStats = BonusStatsEntityFactory.getDefault()
  upsertComponents(
    bonusStats,
    DmgMulComponent({
      dmgMul:
        getRng(offensiveRing).pick(1.5, 2) ?? DmgMulComponent.defaults.dmgMul,
    }),
  )
  upsertRoleEntities(offensiveRing, {
    [EntityRoleEnum.BONUS_STATS]: bonusStats,
  })
}
export const OffensiveRingEntity = getEntityCreator("OFFENSIVE_RING", {
  components: addComponents,
  entities: addEntities,
  loot: addLoot,
})
