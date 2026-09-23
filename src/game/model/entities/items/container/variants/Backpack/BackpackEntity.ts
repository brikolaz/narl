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

const addComponents = (backpack: Entity<"BACKPACK">): void => {
  upsertComponents(
    backpack,
    NameComponent({ name: "Backpack" }),
    GlyphComponent({ glyph: "b" }),
    ContainerComponent(),
    SizeComponent({ size: getRng(backpack).range(2, 4) }),
    NestDepthComponent({ nestDepth: getRng(backpack).range(1, 2) }),
    ColorComponent({ color: COLORS.tier.common }),
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
