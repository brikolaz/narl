import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../../../utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { DefComponent } from "../../../../../components/combat/DefComponent"
import { SpikeComponent } from "../../../../../components/combat/SpikeComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { HeadComponent } from "../../../../../components/equipment/HeadComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { InspectDescComponent } from "../../../../../components/interaction/InspectDescComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (hornedHelmet: Entity<"HORNED_HELMET">): void => {
  upsertComponents(
    hornedHelmet,
    NameComponent({ name: "Horned Helmet" }),
    GlyphComponent({ glyph: "h" }),
    RemovableComponent(),
    HeadComponent(),
    DefComponent({ def: getRng(hornedHelmet).range(3, 4) }),
    PickupableComponent(),
    DroppableComponent(),
    InspectDescComponent({ times: 5, text: "It has horns" }),
    InspectDescComponent({ times: 10, text: "Looks horny" }),
    SpikeComponent(),
    SpikeComponent(),
    ColorComponent({ color: COLORS.tier.common }),
  )
}
const addLoot = (hornedHelmet: Entity<"HORNED_HELMET">): void => {
  void hornedHelmet
}
const addEq = (hornedHelmet: Entity<"HORNED_HELMET">): void => {
  void hornedHelmet
}

export const HornedHelmetEntity = getEntityCreator("HORNED_HELMET", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
