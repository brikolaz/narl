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
import { OffhandComponent } from "../../../../../components/equipment/OffhandComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (shield: Entity<"SHIELD">): void => {
  upsertComponents(
    shield,
    NameComponent({ name: "Wooden Shield" }),
    GlyphComponent({ glyph: "s" }),
    RemovableComponent(),
    OffhandComponent(),
    DefComponent({ def: getRng(shield).range(2, 3) }),
    PickupableComponent(),
    DroppableComponent(),
    ColorComponent({ color: COLORS.tier.common }),
  )
}
const addLoot = (shield: Entity<"SHIELD">): void => {
  void shield
}
const addEq = (shield: Entity<"SHIELD">): void => {
  void shield
}

export const ShieldEntity = getEntityCreator("SHIELD", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
