import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { patchComponentByType } from "../../../../../../../core/model/queries/components/patch"
import { upsertRoleEntities } from "../../../../../../../core/model/queries/entities/add"
import {
  addItemToContainer,
  setContainerItemAt,
} from "../../../../../../systems/containers/containers"
import { getEqSlotByType, initEq } from "../../../../../../systems/eq/eq"
import { getRng } from "../../../../../../systems/rng/rng"
import { FovComponent } from "../../../../../components/ai/FovComponent"
import {
  HostilityComponent,
  HostilityEnum,
} from "../../../../../components/ai/HostilityComponent"
import { UnawareComponent } from "../../../../../components/ai/UnawareComponent"
import { DmgComponent } from "../../../../../components/combat/DmgComponent"
import { HpComponent } from "../../../../../components/combat/HpComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { MainHandSlotComponent } from "../../../../../components/equipment/slots/MainHandSlotComponent"
import { MovableComponent } from "../../../../../components/spatial/MovableComponent"
import { PositionComponent } from "../../../../../components/spatial/PositionComponent"
import { ExpComponent } from "../../../../../components/state/ExpComponent"
import { ContainerEntityFactory } from "../../../../items/container/factory"
import { BackpackEntity } from "../../../../items/container/variants/Backpack/BackpackEntity"
import { HelmetEntityFactory } from "../../../../items/helmet/factory"
import { HornedHelmetEntity } from "../../../../items/helmet/variants/HornedHelmet/HornedHelmetEntity"
import { SwordEntityFactory } from "../../../../items/sword/factory"
import { ArmorEntityFactory } from "../../../../items/armor/factory"

const addComponents = (zoomer: Entity<"ZOOMER">): void => {
  upsertComponents(
    zoomer,
    HpComponent({ hp: 10, maxHp: 10 }),
    ExpComponent({ exp: 50 }),
    GlyphComponent({ glyph: "Z" }),
    NameComponent({ name: "Zoomer" }),
    ColorComponent(),
    HostilityComponent({ hostility: HostilityEnum.HOSTILE }),
    MovableComponent(),
    PositionComponent(),
    UnawareComponent(),
    FovComponent({ range: zoomer.rng.range(5, 7) }),
  )
}

const addLoot = (zoomer: Entity<"ZOOMER">): void => {
  const backpack = ContainerEntityFactory.getVariant(BackpackEntity.type)

  if (getRng(zoomer).chance(5)) {
    ContainerEntityFactory.setDroppable(backpack)
  }
  if (getRng(zoomer).chance(15)) {
    addItemToContainer(
      backpack,
      HelmetEntityFactory.getVariant(HornedHelmetEntity.type),
    )
  }
  if (getRng(zoomer).chance(10)) {
    addItemToContainer(backpack, ArmorEntityFactory.getDefault())
  }

  upsertRoleEntities(zoomer, {
    [EntityRoleEnum.BACKPACK]: backpack,
  })
}

const addEq = (zoomer: Entity<"ZOOMER">): void => {
  initEq(zoomer)
  const sword = SwordEntityFactory.getDefault()
  setContainerItemAt(getEqSlotByType(zoomer, MainHandSlotComponent), 1, sword)
  patchComponentByType(sword, DmgComponent, (dmg) => {
    dmg.min = 3
    dmg.max = 7
  })
}

export const ZoomerEntity = getEntityCreator("ZOOMER", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
