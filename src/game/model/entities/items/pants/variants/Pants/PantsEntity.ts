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
import { PantsComponent } from "../../../../../components/equipment/PantsComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (pants: Entity<"PANTS">): void => {
  upsertComponents(
    pants,
    NameComponent({ name: "Mail Pants" }),
    GlyphComponent({ glyph: "p" }),
    RemovableComponent(),
    PantsComponent(),
    DefComponent({ def: getRng(pants).range(1, 2) }),
    PickupableComponent(),
    DroppableComponent(),
    ColorComponent({ color: COLORS.tier.common }),
  )
}
const addLoot = (pants: Entity<"PANTS">): void => {
  void pants
}
const addEq = (pants: Entity<"PANTS">): void => {
  void pants
}

export const PantsEntity = getEntityCreator("PANTS", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
