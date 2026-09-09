import { getEntityCreator, type Entity } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import type { Enum, EnumType } from "../../../../../utils/types/Enum";
import { getRng } from "../../../../systems/rng/rng";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { HeadComponent } from "../../../components/equipment/HeadComponent";
import { RemovableComponent } from "../../../components/equipment/RemovableComponent";
import { InspectDescComponent } from "../../../components/interaction/InspectDescComponent";
import { DefComponent } from "../../../components/combat/DefComponent";
import { DroppableComponent } from "../../../components/interaction/DroppableComponent";
import { PickupableComponent } from "../../../components/interaction/PickupableComponent";
import { SpikeComponent } from "../../../components/combat/SpikeComponent";
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
      DefComponent({ def: getRng(helmet).range(2, 3) }),
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
      DefComponent({ def: getRng(helmet).range(3, 4) }),
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
