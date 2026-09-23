import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../../../utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { DmgComponent } from "../../../../../components/combat/DmgComponent"
import { PierceComponent } from "../../../../../components/combat/PierceComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { MainHandComponent } from "../../../../../components/equipment/MainHandComponent"
import { OffhandComponent } from "../../../../../components/equipment/OffhandComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

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
    ColorComponent({ color: COLORS.tier.common }),
  )
}

const addLoot = (longSword: Entity<"LONG_SWORD">): void => {
  void longSword
}
const addEq = (longSword: Entity<"LONG_SWORD">): void => {
  void longSword
}

export const LongSwordEntity = getEntityCreator("LONG_SWORD", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
