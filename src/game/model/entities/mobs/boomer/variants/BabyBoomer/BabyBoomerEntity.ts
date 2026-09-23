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
import { ExplodeComponent } from "../../../../../components/combat/ExplodeComponent"
import { ExplodeRangeComponent } from "../../../../../components/combat/ExplodeRangeComponent"
import { HpComponent } from "../../../../../components/combat/HpComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { MovableComponent } from "../../../../../components/spatial/MovableComponent"
import { PositionComponent } from "../../../../../components/spatial/PositionComponent"
import { ExpComponent } from "../../../../../components/state/ExpComponent"
import { ContainerEntityFactory } from "../../../../items/container/factory"
import { BackpackEntity } from "../../../../items/container/variants/Backpack/BackpackEntity"
import { SwordEntityFactory } from "../../../../items/sword/factory"
import { LongSwordEntity } from "../../../../items/sword/variants/LongSword/LongSwordEntity"

const addComponents = (babyBoomer: Entity<"BABY_BOOMER">): void => {
  upsertComponents(
    babyBoomer,
    HpComponent({ hp: 5, maxHp: 5 }),
    ExpComponent({ exp: 25 }),
    GlyphComponent({ glyph: "B" }),
    NameComponent({ name: "Boomer" }),
    ColorComponent(),
    HostilityComponent({ hostility: HostilityEnum.HOSTILE }),
    PositionComponent(),
    ExplodeComponent({ min: 5, max: 9 }),
    ExplodeRangeComponent({ range: babyBoomer.rng.range(3, 5) }),
    UnawareComponent(),
    MovableComponent(),
    DmgComponent(),
    FovComponent({ range: babyBoomer.rng.range(3, 4) }),
  )
}

const addLoot = (babyBoomer: Entity<"BABY_BOOMER">): void => {
  const backpack = ContainerEntityFactory.getVariant(BackpackEntity.type)

  if (getRng(babyBoomer).chance(15)) {
    const longSword = SwordEntityFactory.getVariant(LongSwordEntity.type)
    addItemToContainer(backpack, longSword)
  }

  upsertRoleEntities(babyBoomer, {
    [EntityRoleEnum.BACKPACK]: backpack,
  })
}

const addEq = (babyBoomer: Entity<"BABY_BOOMER">): void => {
  void babyBoomer
}

export const BabyBoomerEntity = getEntityCreator("BABY_BOOMER", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
