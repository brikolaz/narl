import { ProvokableComponent } from "../../../../../components/ai/ProvokableComponent"
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
import {
  HostilityComponent,
  HostilityEnum,
} from "../../../../../components/ai/HostilityComponent"
import { DmgComponent } from "../../../../../components/combat/DmgComponent"
import { HpComponent } from "../../../../../components/combat/HpComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { MainHandSlotComponent } from "../../../../../components/equipment/slots/MainHandSlotComponent"
import { InspectDescComponent } from "../../../../../components/interaction/InspectDescComponent"
import { InspectedComponent } from "../../../../../components/interaction/InspectedComponent"
import { PositionComponent } from "../../../../../components/spatial/PositionComponent"
import { ExpComponent } from "../../../../../components/state/ExpComponent"
import { UnawareComponent } from "../../../../../components/ai/UnawareComponent"
import { ContainerEntityFactory } from "../../../../items/container/factory"
import { BackpackEntity } from "../../../../items/container/variants/Backpack/BackpackEntity"
import { HelmetEntityFactory } from "../../../../items/helmet/factory"
import { SwordEntityFactory } from "../../../../items/sword/factory"

const addComponents = (rageBait: Entity<"RAGE_BAIT">): void => {
  upsertComponents(
    rageBait,
    ProvokableComponent({ damageChance: 50, pokeChance: 20 }),
    HpComponent({ hp: 10, maxHp: 10 }),
    ExpComponent({ exp: 20 }),
    GlyphComponent({ glyph: "R" }),
    NameComponent({ name: "Rage Bait" }),
    ColorComponent(),
    HostilityComponent({
      hostility: getRng(rageBait).chance(1)
        ? HostilityEnum.HOSTILE
        : HostilityEnum.PEACEFUL,
    }),
    PositionComponent(),
    UnawareComponent(),
    InspectedComponent(),
    InspectDescComponent({ text: "It looks cute." }),
  )
}

const addLoot = (rageBait: Entity<"RAGE_BAIT">): void => {
  const backpack = ContainerEntityFactory.getVariant(BackpackEntity.type)

  if (getRng(rageBait).chance(5)) {
    ContainerEntityFactory.setDroppable(backpack)
  }
  if (getRng(rageBait).chance(20)) {
    addItemToContainer(backpack, SwordEntityFactory.getDefault())
  }
  if (getRng(rageBait).chance(20)) {
    addItemToContainer(backpack, HelmetEntityFactory.getDefault())
  }

  upsertRoleEntities(rageBait, {
    [EntityRoleEnum.BACKPACK]: backpack,
  })
}

const addEq = (rageBait: Entity<"RAGE_BAIT">): void => {
  initEq(rageBait)
  const sword = SwordEntityFactory.getDefault()
  setContainerItemAt(getEqSlotByType(rageBait, MainHandSlotComponent), 1, sword)
  patchComponentByType(sword, DmgComponent, (dmg) => {
    dmg.min = 1
    dmg.max = 3
  })
}

export const RageBaitEntity = getEntityCreator("RAGE_BAIT", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
