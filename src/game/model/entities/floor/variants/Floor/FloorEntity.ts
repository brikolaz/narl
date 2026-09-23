import {
  getEntityCreator,
  type Entity,
} from "../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../core/model/queries/components/add"
import { AppearanceComponent } from "../../../../components/display/AppearanceComponent"
import { ColorComponent } from "../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../components/display/GlyphComponent"
const addComponents = (floor: Entity<"FLOOR">): void => {
  upsertComponents(
    floor,
    ColorComponent({ color: "gray" }),
    AppearanceComponent(),
    GlyphComponent({ glyph: "." }),
  )
}
const addLoot = (floor: Entity<"FLOOR">): void => {
  void floor
}
const addEq = (floor: Entity<"FLOOR">): void => {
  void floor
}
export const FloorEntity = getEntityCreator("FLOOR", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
