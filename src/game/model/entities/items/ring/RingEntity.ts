import { getEntityCreator } from "../../../../../core/ecs/Entity";
import { upsertComponents } from "../../../../../core/ecs/queries/components/add";
import type { Symbols } from "../../../../../core/ecs/Symbols";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import { DroppableComponent } from "../../../components/items/DroppableComponent";
import { PickupableComponent } from "../../../components/items/PickupableComponent";
import { VariantComponent } from "../../../components/VariantComponent";
import type { ItemFactory } from "../../../Factory";

export const RingEntityVariants = {
  RING: Symbol.for("RING"),
} as const satisfies Symbols;

export const RingEntity = getEntityCreator("RING");

export const RingEntityFactory: ItemFactory = {
  getDefault: () => {
    const ring = RingEntity();
    upsertComponents(
      ring,
      GlyphComponent({ glyph: "o" }),
      NameComponent({ name: "Ring" }),
      RemovableComponent(),
      RingComponent(),
      PantsComponent(),
      PickupableComponent(),
      DroppableComponent(),
      VariantComponent({ variant: RingEntityVariants.RING }),
    );
    return ring;
  },
};
