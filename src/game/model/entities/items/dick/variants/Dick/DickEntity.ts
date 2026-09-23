import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { getRng } from "../../../../../../systems/rng/rng"
import { DmgComponent } from "../../../../../components/combat/DmgComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { MainHandComponent } from "../../../../../components/equipment/MainHandComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (dick: Entity<"DICK">): void => {
  const dmg = getRng(dick).range(1, 3)
  upsertComponents(
    dick,
    GlyphComponent({ glyph: "=" }),
    NameComponent({ name: "Dick" }),
    DmgComponent({ min: dmg, max: dmg }),
    RemovableComponent(),
    MainHandComponent(),
    PickupableComponent(),
    DroppableComponent(),
  )
}
const addLoot = (dick: Entity<"DICK">): void => {
  void dick
}
const addEq = (dick: Entity<"DICK">): void => {
  void dick
}
export const DickEntity = getEntityCreator("DICK", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
