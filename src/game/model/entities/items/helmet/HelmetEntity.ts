import { getEntityCreator, type Entity } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import type { Symbols } from "../../../../../core/ecs/Symbols";
import { RNG } from "../../../../systems/rng/rng";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { HeadComponent } from "../../../components/eq/HeadComponent";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { InspectDescComponent } from "../../../components/inspect/InspectDescComponent";
import { DefComponent } from "../../../components/items/DefComponent";
import { DroppableComponent } from "../../../components/items/DroppableComponent";
import { PickupableComponent } from "../../../components/items/PickupableComponent";
import { VariantComponent } from "../../../components/VariantComponent";
import type { ItemFactory } from "../../../Factory";

export const HelmetEntityVariants = {
  HELMET: Symbol("Helmet"),
  HORNED_HELMET: Symbol("Horned Helmet"),
} as const satisfies Symbols;

type HelmetFactory = ItemFactory & {
  getHornedHelmet: () => Entity;
};

export const HelmetEntity = getEntityCreator("HELMET");

export const HelmetEntityFactory: HelmetFactory = {
  getDefault: () => {
    const helmet = HelmetEntity();

    addComponents(
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
      VariantComponent({
        variant: HelmetEntityVariants.HELMET,
      }),
    );

    return helmet;
  },

  getHornedHelmet: () => {
    const helmet = HelmetEntity();

    addComponents(
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
      VariantComponent({
        variant: HelmetEntityVariants.HORNED_HELMET,
      }),
      InspectDescComponent({ times: 5, text: "It has horns" }),
      InspectDescComponent({ times: 10, text: "Looks horny" }),
    );

    return helmet
  },
};
