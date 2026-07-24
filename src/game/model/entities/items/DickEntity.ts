import { getEntityCreator } from "../../../../core/ecs/Entity";
import { upsertComponents } from "../../../../core/ecs/queries/components/add";
import { RNG } from "../../../systems/rng/rng";
import { GlyphComponent } from "../../components/display/GlyphComponent";
import { NameComponent } from "../../components/display/NameComponent";
import { MainHandComponent } from "../../components/eq/MainHandComponent";
import { RemovableComponent } from "../../components/eq/RemovableComponent";
import { DmgComponent } from "../../components/items/DmgComponent";
import { DroppableComponent } from "../../components/items/DroppableComponent";
import { PickupableComponent } from "../../components/items/PickupableComponent";
import type { ItemFactory } from "../../Factory";

export const DickEntity = getEntityCreator("DICK");

export const DickEntityFactory: ItemFactory = {
  getDefault: () => {
    const dick = DickEntity();
    upsertComponents(
      dick,
      GlyphComponent({ glyph: "=" }),
      NameComponent({ name: "Dick" }),
      DmgComponent({dmg: RNG.items.range(1,3)}),
      RemovableComponent(),
      MainHandComponent(),
      PickupableComponent(),
      DroppableComponent(),
    );
    return dick;
  },
};
