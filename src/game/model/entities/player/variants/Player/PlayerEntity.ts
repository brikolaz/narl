import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../core/model/queries/components/add"
import { upsertRoleEntities } from "../../../../../../core/model/queries/entities/add"
import {
  DEFAULT_PLAYER_GLYPH,
  INITIAL_PLAYER_POSITION,
} from "../../../../../../utils/constants"
import { initEq } from "../../../../../systems/eq/eq"
import { BlockComponent } from "../../../../components/BlockComponent"
import { HealComponent } from "../../../../components/HealComponent"
import { HpComponent } from "../../../../components/combat/HpComponent"
import { ColorComponent } from "../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../components/display/NameComponent"
import { PositionComponent } from "../../../../components/spatial/PositionComponent"
import { ExpComponent } from "../../../../components/state/ExpComponent"
import { ContainerEntityFactory } from "../../../items/container/factory"
import { PlayerBackpackEntity } from "../../../items/container/variants/PlayerBackpack/PlayerBackpackEntity"

const addComponents = (player: Entity<"PLAYER">): void => {
  upsertComponents(
    player,
    GlyphComponent({ glyph: DEFAULT_PLAYER_GLYPH }),
    ExpComponent(),
    ColorComponent(),
    NameComponent({ name: "You" }),
    HpComponent({ hp: 20, maxHp: 20 }),
    PositionComponent({ position: INITIAL_PLAYER_POSITION }),
    HealComponent({ min: 4, max: 5 }),
    BlockComponent({ def: 1 }),
  )
}
const addLoot = (player: Entity<"PLAYER">): void => {
  upsertRoleEntities(player, {
    [EntityRoleEnum.BACKPACK]: ContainerEntityFactory.getVariant(
      PlayerBackpackEntity.type,
    ),
  })
}
const addEq = (player: Entity<"PLAYER">): void => {
  initEq(player)
}
export const PlayerEntity = getEntityCreator("PLAYER", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
