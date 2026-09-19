import { getEntityCreator } from "../../../core/model/Entity"
import { upsertComponents } from "../../../core/model/queries/components/add"
import { GlyphComponent } from "../components/display/GlyphComponent"
import { NameComponent } from "../components/display/NameComponent"
import { ImpassableComponent } from "../components/spatial/ImpassableComponent"
import type { Factory } from "../Factory"

const WallEntity = getEntityCreator("WALL")
export type WallEntityVariants = typeof WallEntity.type

export const WallEntityFactory: Factory<WallEntityVariants> = {
  getDefault: () => {
    const wall = WallEntity()

    upsertComponents(
      wall,
      NameComponent({ name: "Wall" }),
      GlyphComponent({ glyph: "#" }),
      ImpassableComponent(),
    )
    return wall
  },
}
