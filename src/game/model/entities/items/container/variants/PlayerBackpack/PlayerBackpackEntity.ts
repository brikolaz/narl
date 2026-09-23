import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../../../utils/colors"
import { DEFAULT_PLAYER_BACKPACK_SIZE } from "../../../../../../../utils/constants"
import { ContainerComponent } from "../../../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../../../components/containers/SizeComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"

const addComponents = (playerBackpack: Entity<"PLAYER_BACKPACK">): void => {
  upsertComponents(
    playerBackpack,
    NameComponent({ name: "Backpack" }),
    GlyphComponent({ glyph: "*" }),
    ContainerComponent(),
    SizeComponent({ size: DEFAULT_PLAYER_BACKPACK_SIZE }),
    ColorComponent({ color: COLORS.tier.common }),
  )
}
const addLoot = (playerBackpack: Entity<"PLAYER_BACKPACK">): void => {
  void playerBackpack
}
const addEq = (playerBackpack: Entity<"PLAYER_BACKPACK">): void => {
  void playerBackpack
}
export const PlayerBackpackEntity = getEntityCreator("PLAYER_BACKPACK", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
