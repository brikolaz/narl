import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../../../utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { DefComponent } from "../../../../../components/combat/DefComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { BootsComponent } from "../../../../../components/equipment/BootsComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (boots: Entity<"BOOTS">): void => {
  upsertComponents(
    boots,
    NameComponent({ name: "Boots" }),
    GlyphComponent({ glyph: "b" }),
    RemovableComponent(),
    BootsComponent(),
    DefComponent({ def: getRng(boots).range(1, 2) }),
    PickupableComponent(),
    DroppableComponent(),
    ColorComponent({ color: COLORS.tier.common }),
  )
}
const addLoot = (boots: Entity<"BOOTS">): void => {
  void boots
}
const addEq = (boots: Entity<"BOOTS">): void => {
  void boots
}

export const BootsEntity = getEntityCreator("BOOTS", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
