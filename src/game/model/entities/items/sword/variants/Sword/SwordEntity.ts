import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../../../utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { DmgComponent } from "../../../../../components/combat/DmgComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { MainHandComponent } from "../../../../../components/equipment/MainHandComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (sword: Entity<"SWORD">): void => {
  const minDmg = getRng(sword).range(4, 6)
  upsertComponents(
    sword,
    GlyphComponent({ glyph: "/" }),
    NameComponent({ name: "Sword" }),
    RemovableComponent(),
    MainHandComponent(),
    ColorComponent({ color: COLORS.tier.common }),
    DmgComponent({ min: minDmg, max: minDmg + 3 }),
    PickupableComponent(),
    DroppableComponent(),
  )
}

const addLoot = (sword: Entity<"SWORD">): void => {
  void sword
}
const addEq = (sword: Entity<"SWORD">): void => {
  void sword
}

export const SwordEntity = getEntityCreator("SWORD", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
