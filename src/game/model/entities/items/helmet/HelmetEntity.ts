import { getEntityCreator, type Entity } from "../../../../../core/model/Entity";
import type { Enum, EnumType } from "../../../../../utils/types/Enum";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { RNG } from "../../../../systems/rng/rng";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { HeadComponent } from "../../../components/eq/HeadComponent";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { InspectDescComponent } from "../../../components/inspect/InspectDescComponent";
import { DefComponent } from "../../../components/items/DefComponent";
import { DroppableComponent } from "../../../components/items/DroppableComponent";
import { PickupableComponent } from "../../../components/items/PickupableComponent";
import { SpikeComponent } from "../../../components/items/SpikeComponent";
import type { ItemFactory } from "../../../Factory";

export const HelmetEntityVariants = {
  DEFAULT: "Helmet",
  HORNED_HELMET: "Horned Helmet",
} as const satisfies Enum;
type HelmetEntityVariants = EnumType<typeof HelmetEntityVariants>;

type HelmetFactory = ItemFactory & {
  getHornedHelmet: () => Entity;
};

export const HelmetEntity = getEntityCreator("HELMET");

export const HelmetEntityFactory: HelmetFactory = {
  getDefault: () => {
    const helmet = HelmetEntity();

    upsertComponents(
      helmet,
      NameComponent({ name: "Helmet" }),
      GlyphComponent({
        glyph: "H",
      }),
      RemovableComponent(),
      HeadComponent(),
      DefComponent({ def: RNG.items.range(3, 4) }),
      PickupableComponent(),
      DroppableComponent(),
    );

    return helmet;
  },

  getHornedHelmet: () => {
    const helmet = HelmetEntity();

    upsertComponents(
      helmet,
      NameComponent({ name: "Horned Helmet" }),
      GlyphComponent({
        glyph: "H",
      }),
      RemovableComponent(),
      HeadComponent(),
      DefComponent({ def: RNG.items.range(3, 4) }),
      PickupableComponent(),
      DroppableComponent(),
      InspectDescComponent({ times: 5, text: "It has horns" }),
      InspectDescComponent({ times: 10, text: "Looks horny" }),
      SpikeComponent(),
      SpikeComponent(),
    );

    return helmet;
  },

  getVariant: (variant: HelmetEntityVariants) => {
    switch (variant) {
      case HelmetEntityVariants.HORNED_HELMET:
        return HelmetEntityFactory.getHornedHelmet();
      default:
        return HelmetEntityFactory.getDefault();
    }
  },
};
