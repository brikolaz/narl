import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../../../utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { ContainerComponent } from "../../../../../components/containers/ContainerComponent"
import { NestDepthComponent } from "../../../../../components/containers/NestDepthComponent"
import { SizeComponent } from "../../../../../components/containers/SizeComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { MainHandComponent } from "../../../../../components/equipment/MainHandComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (backpack: Entity<"BACKPACK">): void => {
  upsertComponents(
    backpack,
    NameComponent({ name: "Backpack" }),
    GlyphComponent({ glyph: "d" }),
    ContainerComponent(),
    SizeComponent({ size: getRng(backpack).range(3, 4) }),
    NestDepthComponent({ nestDepth: getRng(backpack).range(1, 2) }),
    ColorComponent({ color: COLORS.tier.common }),
    PickupableComponent(),
    RemovableComponent(),
    MainHandComponent(),
  )
}
const addLoot = (backpack: Entity<"BACKPACK">): void => {
  void backpack
}
const addEq = (backpack: Entity<"BACKPACK">): void => {
  void backpack
}
export const BackpackEntity = getEntityCreator("BACKPACK", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
