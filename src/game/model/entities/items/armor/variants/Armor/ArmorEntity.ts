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
import { ChestComponent } from "../../../../../components/equipment/ChestComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (armor: Entity<"ARMOR">): void => {
  upsertComponents(
    armor,
    NameComponent({ name: "Mail Chest" }),
    GlyphComponent({ glyph: "c" }),
    RemovableComponent(),
    ChestComponent(),
    DefComponent({ def: getRng(armor).range(3, 4) }),
    PickupableComponent(),
    DroppableComponent(),
    ColorComponent({ color: COLORS.tier.common }),
  )
}
const addLoot = (armor: Entity<"ARMOR">): void => {
  void armor
}
const addEq = (armor: Entity<"ARMOR">): void => {
  void armor
}

export const ArmorEntity = getEntityCreator("ARMOR", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
