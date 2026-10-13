import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../../../utils/colors"
import { getRng } from "../../../../../../systems/rng/rng"
import { BleedingEffectComponent } from "../../../../../components/combat/BleedingEffectComponent"
import { DmgComponent } from "../../../../../components/combat/DmgComponent"
import { ColorComponent } from "../../../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../../../components/display/GlyphComponent"
import { NameComponent } from "../../../../../components/display/NameComponent"
import { MainHandComponent } from "../../../../../components/equipment/MainHandComponent"
import { RemovableComponent } from "../../../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../../../components/interaction/PickupableComponent"

const addComponents = (axe: Entity<"AXE">): void => {
  const minDmg = getRng(axe).range(3, 5)
  upsertComponents(
    axe,
    GlyphComponent({ glyph: "}" }),
    NameComponent({ name: "Axe" }),
    RemovableComponent(),
    MainHandComponent(),
    ColorComponent({ color: COLORS.tier.common }),
    DmgComponent({ min: minDmg, max: minDmg + 2 }),
    PickupableComponent(),
    DroppableComponent(),
    BleedingEffectComponent({
      chance: 50,
      min: 4,
      max: 6,
      duration: 2,
    }),
  )
}

const addLoot = (axe: Entity<"AXE">): void => {
  void axe
}

const addEntities = (axe: Entity<"AXE">): void => {
  void axe
}

export const AxeEntity = getEntityCreator("AXE", {
  components: addComponents,
  entities: addEntities,
  loot: addLoot,
})
