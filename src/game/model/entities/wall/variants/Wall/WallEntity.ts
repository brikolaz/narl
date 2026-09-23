import {
  getEntityCreator,
  type Entity,
} from "../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../core/model/queries/components/add"
import { GlyphComponent } from "../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../components/display/NameComponent"
import { ImpassableComponent } from "../../../../components/spatial/ImpassableComponent"
const addComponents = (wall: Entity<"WALL">): void => {
  upsertComponents(
    wall,
    NameComponent({ name: "Wall" }),
    GlyphComponent({ glyph: "#" }),
    ImpassableComponent(),
  )
}
const addLoot = (wall: Entity<"WALL">): void => {
  void wall
}
const addEq = (wall: Entity<"WALL">): void => {
  void wall
}
export const WallEntity = getEntityCreator("WALL", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
