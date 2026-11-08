import { upsertRoleEntities } from "../../../../../../../core/model/queries/entities/add"
import { BonusStatsEntityFactory } from "../../../../bonusStats/factory"
import { DmgMulComponent } from "../../../../../components/combat/DmgMulComponent"
import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"

import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../../../core/utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { DefMulComponent } from "../../../../../components/combat/DefMulComponent"
import { ContainerComponent } from "../../../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../../../components/containers/SizeComponent"
import { ThreadComponent } from "../../../../../components/containers/ThreadComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (defensiveString: Entity<"DEFENSIVE_STRING">): void => {
  upsertComponents(
    defensiveString,
    NameComponent({ name: "ENTITY.DEFENSIVE_STRING" }),
    GlyphComponent({ glyph: "s" }),
    ThreadComponent(),
    ContainerComponent(),
    DefMulComponent({ defMul: 0 }),
    DmgMulComponent({ dmgMul: 0.5 }),
    SizeComponent({ size: getRng(defensiveString).range(2, 3) }),
    ColorComponent({ color: COLORS.tier.common }),
    PickupableComponent(),
    DroppableComponent(),
    RemovableComponent(),
  )
}

const addLoot = (defensiveString: Entity<"DEFENSIVE_STRING">): void => {
  void defensiveString
}

const addEntities = (defensiveString: Entity<"DEFENSIVE_STRING">): void => {
  const bonusStats = BonusStatsEntityFactory.getDefault()
  upsertComponents(bonusStats, DmgMulComponent({ dmgMul: 0.5 }))
  upsertRoleEntities(defensiveString, {
    [EntityRoleEnum.BONUS_STATS]: bonusStats,
  })
}

export const DefensiveStringEntity = getEntityCreator("DEFENSIVE_STRING", {
  components: addComponents,
  entities: addEntities,
  loot: addLoot,
})
