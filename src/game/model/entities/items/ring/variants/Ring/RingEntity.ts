import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { upsertRoleEntities } from "../../../../../../../core/model/queries/entities/add"
import { COLORS } from "../../../../../../../utils/colors"
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
import { BonusStatsEntityFactory } from "../../../../bonusStats/factory"

const addComponents = (ring: Entity<"RING">): void => {
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
}
const addLoot = (ring: Entity<"RING">): void => {
  void ring
}
const addEq = (ring: Entity<"RING">): void => {
  const bonusStats = BonusStatsEntityFactory.getDefault()
  upsertComponents(
    bonusStats,
    DmgMulComponent({
      dmgMul: getRng(ring).pick(1.5, 2) ?? DmgMulComponent.defaults.dmgMul,
    }),
  )
  upsertRoleEntities(ring, { [EntityRoleEnum.BONUS_STATS]: bonusStats })
}
export const RingEntity = getEntityCreator("RING", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
