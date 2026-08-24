import { getEntityCreator } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import { DroppableComponent } from "../../../components/items/DroppableComponent";
import { PickupableComponent } from "../../../components/items/PickupableComponent";
import type { ItemFactory } from "../../../Factory";

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
    );
    return ring;
  },
};
