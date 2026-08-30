import { getEntityCreator } from "../../../../core/model/Entity";
import { upsertComponents } from "../../../../core/model/queries/components/add";
import { getRng } from "../../../systems/rng/rng";
import { GlyphComponent } from "../../components/display/GlyphComponent";
import { NameComponent } from "../../components/display/NameComponent";
import { MainHandComponent } from "../../components/eq/MainHandComponent";
import { RemovableComponent } from "../../components/eq/RemovableComponent";
import { DmgComponent } from "../../components/items/DmgComponent";
import { DroppableComponent } from "../../components/items/DroppableComponent";
import { PickupableComponent } from "../../components/items/PickupableComponent";
import type { ItemFactory } from "../../Factory";

export const SwordEntity = getEntityCreator("SWORD");

export const SwordEntityFactory: ItemFactory = {
  getDefault: () => {
    const sword = SwordEntity();
    const minDmg = getRng(sword).range(4, 6);
    
    upsertComponents(
      sword,
      GlyphComponent({
        glyph: "/" as string,
      }),
      NameComponent({ name: "Sword" }),
      RemovableComponent(),
      MainHandComponent(),

      DmgComponent({ min: minDmg, max: minDmg + 3 }),
      PickupableComponent(),
      DroppableComponent(),
    );

    return sword;
  },
};
