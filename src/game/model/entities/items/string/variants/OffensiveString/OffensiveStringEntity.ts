import { upsertRoleEntities } from "../../../../../../../core/model/queries/entities/add"
import { BonusStatsEntityFactory } from "../../../../bonusStats/factory"
import { DefMulComponent } from "../../../../../components/combat/DefMulComponent"
import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"

import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../../../core/utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { DmgMulComponent } from "../../../../../components/combat/DmgMulComponent"
import { ContainerComponent } from "../../../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../../../components/containers/SizeComponent"
import { ThreadComponent } from "../../../../../components/containers/ThreadComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (offensiveString: Entity<"OFFENSIVE_STRING">): void => {
  upsertComponents(
    offensiveString,
    NameComponent({ name: "ENTITY.OFFENSIVE_STRING" }),
    GlyphComponent({ glyph: "s" }),
    ThreadComponent(),
    ContainerComponent(),
    DmgMulComponent({ dmgMul: 0.5 }),
    DefMulComponent({ defMul: 0 }),
    SizeComponent({ size: getRng(offensiveString).range(2, 3) }),
    ColorComponent({ color: COLORS.tier.common }),
    PickupableComponent(),
    DroppableComponent(),
    RemovableComponent(),
  )
}

const addLoot = (offensiveString: Entity<"OFFENSIVE_STRING">): void => {
  void offensiveString
}

const addEntities = (offensiveString: Entity<"OFFENSIVE_STRING">): void => {
  const bonusStats = BonusStatsEntityFactory.getDefault()
  upsertComponents(bonusStats, DmgMulComponent({ dmgMul: 0.5 }))
  upsertRoleEntities(offensiveString, {
    [EntityRoleEnum.BONUS_STATS]: bonusStats,
  })
}

export const OffensiveStringEntity = getEntityCreator("OFFENSIVE_STRING", {
  components: addComponents,
  entities: addEntities,
  loot: addLoot,
})
