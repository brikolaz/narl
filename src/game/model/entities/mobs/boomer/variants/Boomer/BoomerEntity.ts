import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { upsertRoleEntities } from "../../../../../../../core/model/queries/entities/add"
import { addItemToContainer } from "../../../../../../systems/containers/containers"
import { getRng } from "../../../../../../systems/rng/rng"
import { FovComponent } from "../../../../../components/ai/FovComponent"
import {
  HostilityComponent,
  HostilityEnum,
} from "../../../../../components/ai/HostilityComponent"
import { UnawareComponent } from "../../../../../components/ai/UnawareComponent"
import { DmgComponent } from "../../../../../components/combat/DmgComponent"
import { DmgMulComponent } from "../../../../../components/combat/DmgMulComponent"
import { ExplodeComponent } from "../../../../../components/combat/ExplodeComponent"
import { ExplodeRangeComponent } from "../../../../../components/combat/ExplodeRangeComponent"
import { HpComponent } from "../../../../../components/combat/HpComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { MovableComponent } from "../../../../../components/spatial/MovableComponent"
import { PositionComponent } from "../../../../../components/spatial/PositionComponent"
import { ExpComponent } from "../../../../../components/state/ExpComponent"
import { BonusStatsEntityFactory } from "../../../../bonusStats/factory"
import { ContainerEntityFactory } from "../../../../items/container/factory"
import { BackpackEntity } from "../../../../items/container/variants/Backpack/BackpackEntity"
import { SwordEntityFactory } from "../../../../items/sword/factory"
import { LongSwordEntity } from "../../../../items/sword/variants/LongSword/LongSwordEntity"

const addComponents = (boomer: Entity<"BOOMER">): void => {
  upsertComponents(
    boomer,
    HpComponent({ hp: 6, maxHp: 6 }),
    ExpComponent({ exp: 35 }),
    GlyphComponent({ glyph: "B" }),
    NameComponent({ name: "Boomer" }),
    ColorComponent(),
    HostilityComponent({ hostility: HostilityEnum.HOSTILE }),
    PositionComponent(),
    ExplodeComponent({ min: 7, max: 11 }),
    ExplodeRangeComponent({ range: boomer.rng.range(4, 6) }),
    UnawareComponent(),
    MovableComponent(),
    DmgComponent(),
    FovComponent({ range: boomer.rng.range(4, 5) }),
  )
}

const addLoot = (boomer: Entity<"BOOMER">): void => {
  const backpack = ContainerEntityFactory.getVariant(BackpackEntity.type)

  if (getRng(boomer).chance(15)) {
    const longSword = SwordEntityFactory.getVariant(LongSwordEntity.type)
    addItemToContainer(backpack, longSword)

    if (getRng(boomer).chance(20)) {
      const bonusStats = BonusStatsEntityFactory.getDefault()
      upsertComponents(
        bonusStats,
        DmgMulComponent({
          dmgMul:
            getRng(longSword).pick(1.5, 2) ?? DmgMulComponent.defaults.dmgMul,
        }),
      )
      upsertRoleEntities(boomer, { [EntityRoleEnum.BONUS_STATS]: bonusStats })
    }
  }

  upsertRoleEntities(boomer, {
    [EntityRoleEnum.BACKPACK]: backpack,
  })
}

const addEq = (boomer: Entity<"BOOMER">): void => {
  void boomer
}

export const BoomerEntity = getEntityCreator("BOOMER", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
