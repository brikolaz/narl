import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { upsertRoleEntities } from "../../../../../../../core/model/queries/entities/add"
import { COLORS } from "../../../../../../../utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { DmgComponent } from "../../../../../components/combat/DmgComponent"
import { DmgMulComponent } from "../../../../../components/combat/DmgMulComponent"
import { PierceComponent } from "../../../../../components/combat/PierceComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { MainHandComponent } from "../../../../../components/equipment/MainHandComponent"
import { OffhandComponent } from "../../../../../components/equipment/OffhandComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"
import { BonusStatsEntityFactory } from "../../../../bonusStats/factory"

const addComponents = (longSword: Entity<"LONG_SWORD">): void => {
  const minDmg = getRng(longSword).range(5, 6)
  upsertComponents(
    longSword,
    GlyphComponent({ glyph: "/" }),
    NameComponent({ name: "Long Sword" }),
    RemovableComponent(),
    MainHandComponent(),
    OffhandComponent(),
    DmgComponent({ min: minDmg, max: minDmg + 3 }),
    PierceComponent({ pierce: 2 }),
    PickupableComponent(),
    DroppableComponent(),
    ColorComponent({ color: COLORS.tier.uncommon }),
  )
}

const addLoot = (longSword: Entity<"LONG_SWORD">): void => {
  void longSword
}
const addEntities = (longSword: Entity<"LONG_SWORD">): void => {
  if (getRng(longSword).chance(20)) {
    const bonusStats = BonusStatsEntityFactory.getDefault()
    upsertComponents(
      bonusStats,
      DmgMulComponent({
        dmgMul:
          getRng(longSword).pick(1.5, 2) ?? DmgMulComponent.defaults.dmgMul,
      }),
    )
    upsertRoleEntities(longSword, {
      [EntityRoleEnum.BONUS_STATS]: bonusStats,
    })
  }
}

export const LongSwordEntity = getEntityCreator("LONG_SWORD", {
  components: addComponents,
  entities: addEntities,
  loot: addLoot,
})
