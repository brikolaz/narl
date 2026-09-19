import { getEntityCreator, type Entity } from "../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../core/model/queries/components/add"
import { getRng } from "../../../../systems/rng/rng"
import { GlyphComponent } from "../../../components/display/GlyphComponent"
import { NameComponent } from "../../../components/display/NameComponent"
import { HeadComponent } from "../../../components/equipment/HeadComponent"
import { RemovableComponent } from "../../../components/equipment/RemovableComponent"
import { InspectDescComponent } from "../../../components/interaction/InspectDescComponent"
import { DefComponent } from "../../../components/combat/DefComponent"
import { DroppableComponent } from "../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../components/interaction/PickupableComponent"
import { SpikeComponent } from "../../../components/combat/SpikeComponent"
import type { ItemFactory } from "../../../Factory"
import { ColorComponent } from "../../../components/display/ColorComponent"
import { COLORS } from "../../../../../utils/colors"

export const HelmetEntity = getEntityCreator("HELMET")
export const HornedHelmetEntity = getEntityCreator("HORNED_HELMET")

type HelmetEntityVariants =
  typeof HelmetEntity.type | typeof HornedHelmetEntity.type

type HelmetFactory = ItemFactory<HelmetEntityVariants> & {
  getHornedHelmet: () => Entity
}

export const HelmetEntityFactory: HelmetFactory = {
  getDefault: () => {
    const helmet = HelmetEntity()

    upsertComponents(
      helmet,
      NameComponent({ name: "Helmet" }),
      GlyphComponent({
        glyph: "h",
      }),
      RemovableComponent(),
      HeadComponent(),
      DefComponent({ def: getRng(helmet).range(2, 3) }),
      PickupableComponent(),
      DroppableComponent(),
      ColorComponent({ color: COLORS.tier.common }),
    )

    return helmet
  },

  getHornedHelmet: () => {
    const helmet = HornedHelmetEntity()

    upsertComponents(
      helmet,
      NameComponent({ name: "Horned Helmet" }),
      GlyphComponent({
        glyph: "h",
      }),
      RemovableComponent(),
      HeadComponent(),
      DefComponent({ def: getRng(helmet).range(3, 4) }),
      PickupableComponent(),
      DroppableComponent(),
      InspectDescComponent({ times: 5, text: "It has horns" }),
      InspectDescComponent({ times: 10, text: "Looks horny" }),
      SpikeComponent(),
      SpikeComponent(),
      ColorComponent({ color: COLORS.tier.common }),
    )

    return helmet
  },

  getVariant: (variant) => {
    switch (variant) {
      case HelmetEntity.type:
        return HelmetEntityFactory.getDefault()
      case HornedHelmetEntity.type:
        return HelmetEntityFactory.getHornedHelmet()
    }
    throw new Error("Unknown helmet variant")
  },
}
