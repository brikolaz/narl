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
import { HeadComponent } from "../../../../../components/equipment/HeadComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (helmet: Entity<"HELMET">): void => {
  upsertComponents(
    helmet,
    NameComponent({ name: "Helmet" }),
    GlyphComponent({ glyph: "h" }),
    RemovableComponent(),
    HeadComponent(),
    DefComponent({ def: getRng(helmet).range(1, 2) }),
    PickupableComponent(),
    DroppableComponent(),
    ColorComponent({ color: COLORS.tier.common }),
  )
}
const addLoot = (helmet: Entity<"HELMET">): void => {
  void helmet
}
const addEntities = (helmet: Entity<"HELMET">): void => {
  void helmet
}

export const HelmetEntity = getEntityCreator("HELMET", {
  components: addComponents,
  entities: addEntities,
  loot: addLoot,
})
