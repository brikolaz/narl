import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../../../utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { ContainerComponent } from "../../../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../../../components/containers/SizeComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"

const addComponents = (container: Entity<"CONTAINER">): void => {
  upsertComponents(
    container,
    NameComponent({ name: "Container" }),
    GlyphComponent({ glyph: "C" }),
    ContainerComponent(),
    SizeComponent({ size: getRng(container).range(2, 4) }),
    ColorComponent({ color: COLORS.tier.common }),
  )
}
const addLoot = (container: Entity<"CONTAINER">): void => {
  void container
}
const addEq = (container: Entity<"CONTAINER">): void => {
  void container
}
export const ContainerEntity = getEntityCreator("CONTAINER", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
