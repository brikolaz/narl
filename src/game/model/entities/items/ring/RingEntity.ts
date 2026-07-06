import { Entity } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import { DroppableComponent } from "../../../components/items/DroppableComponent";
import { PickupableComponent } from "../../../components/items/PickupableComponent";
import { VariantComponent } from "../../../components/VariantComponent";
import type { Factory } from "../../../Factory";

export const RingEntityVariants = {
  RING: Symbol.for("RING"),
} as const;

const RingEntity = Entity;

export const RingEntityFactory: Factory = {
  getDefault: () => {
    const ring = RingEntity();
    addComponents(
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
