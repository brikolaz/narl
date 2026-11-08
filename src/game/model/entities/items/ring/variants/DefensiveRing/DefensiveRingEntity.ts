import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { upsertRoleEntities } from "../../../../../../../core/model/queries/entities/add"
import { COLORS } from "../../../../../../../core/utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { DefMulComponent } from "../../../../../components/combat/DefMulComponent"
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

const addComponents = (defensiveRing: Entity<"DEFENSIVE_RING">): void => {
  upsertComponents(
    defensiveRing,
    GlyphComponent({ glyph: "o" }),
    NameComponent({ name: "ENTITY.DEFENSIVE_RING" }),
    RemovableComponent(),
    RingComponent(),
    PantsComponent(),
    PickupableComponent(),
    DroppableComponent(),
    ColorComponent({ color: COLORS.tier.common }),
  )

  if (getRng(defensiveRing).namedChance(80, "SEVERING_CURSE")) {
    upsertComponents(defensiveRing, SeveringCurseComponent())
  }
}
const addLoot = (defensiveRing: Entity<"DEFENSIVE_RING">): void => {
  void defensiveRing
}

const addEntities = (defensiveRing: Entity<"DEFENSIVE_RING">): void => {
  const bonusStats = BonusStatsEntityFactory.getDefault()
  upsertComponents(
    bonusStats,
    DefMulComponent({
      defMul:
        getRng(defensiveRing).pick(1.5, 2) ?? DefMulComponent.defaults.defMul,
    }),
  )
  upsertRoleEntities(defensiveRing, {
    [EntityRoleEnum.BONUS_STATS]: bonusStats,
  })
}
export const DefensiveRingEntity = getEntityCreator("DEFENSIVE_RING", {
  components: addComponents,
  entities: addEntities,
  loot: addLoot,
})
