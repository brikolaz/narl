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

export const DickEntity = getEntityCreator("DICK");

export const DickEntityFactory: ItemFactory = {
  getDefault: () => {
    const dick = DickEntity();
    const dmg = getRng(dick).range(1, 3);
    upsertComponents(
      dick,
      GlyphComponent({ glyph: "=" }),
      NameComponent({ name: "Dick" }),
      DmgComponent({ min: dmg, max: dmg }),
      RemovableComponent(),
      MainHandComponent(),
      PickupableComponent(),
      DroppableComponent(),
    );
    return dick;
  },
};
