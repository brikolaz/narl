import { getEntityCreator, type Entity } from "../../../../core/model/Entity"
import { upsertComponents } from "../../../../core/model/queries/components/add"
import { createEnum, type EnumType } from "../../../../utils/types/Enum"
import { getRng } from "../../../systems/rng/rng"
import { GlyphComponent } from "../../components/display/GlyphComponent"
import { NameComponent } from "../../components/display/NameComponent"
import { MainHandComponent } from "../../components/equipment/MainHandComponent"
import { OffhandComponent } from "../../components/equipment/OffhandComponent"
import { RemovableComponent } from "../../components/equipment/RemovableComponent"
import { DmgComponent } from "../../components/combat/DmgComponent"
import { DroppableComponent } from "../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../components/interaction/PickupableComponent"
import { PierceComponent } from "../../components/combat/PierceComponent"
import type { ItemFactory } from "../../Factory"
import { ColorComponent } from "../../components/display/ColorComponent"
import { COLORS } from "../../../../utils/colors"

const SwordEntityVariantsEnum = createEnum("DEFAULT", "LONG_SWORD")
type SwordEntityVariantsEnum = EnumType<typeof SwordEntityVariantsEnum>

const SwordEntity = getEntityCreator("SWORD")

type SwordEntityFactory = ItemFactory & {
  getLongSword: () => Entity
}

export const SwordEntityFactory: SwordEntityFactory = {
  getDefault: () => {
    const sword = SwordEntity()
    const minDmg = getRng(sword).range(4, 6)

    upsertComponents(
      sword,
      GlyphComponent({
        glyph: "/",
      }),
      NameComponent({ name: "Sword" }),
      RemovableComponent(),
      MainHandComponent(),
      ColorComponent({ color: COLORS.tier.common }),
      DmgComponent({ min: minDmg, max: minDmg + 3 }),
      PickupableComponent(),
      DroppableComponent(),
    )

    return sword
  },
  getLongSword: () => {
    const longSword = SwordEntity()
    const minDmg = getRng(longSword).range(5, 6)

    upsertComponents(
      longSword,
      GlyphComponent({
        glyph: "/",
      }),
      NameComponent({ name: "Long Sword" }),
      RemovableComponent(),
      MainHandComponent(),
      OffhandComponent(),
      DmgComponent({ min: minDmg, max: minDmg + 3 }),
      PierceComponent({ pierce: 2 }),
      PickupableComponent(),
      DroppableComponent(),
      ColorComponent({ color: COLORS.tier.common }),
    )

    return longSword
  },
  getVariant: (variant: SwordEntityVariantsEnum) => {
    switch (variant) {
      case SwordEntityVariantsEnum.DEFAULT:
        return SwordEntityFactory.getDefault()
      case SwordEntityVariantsEnum.LONG_SWORD:
        return SwordEntityFactory.getLongSword()
    }
  },
}
