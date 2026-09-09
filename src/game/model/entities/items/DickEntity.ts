import { getEntityCreator } from "../../../../core/model/Entity";
import { upsertComponents } from "../../../../core/model/queries/components/add";
import { getRng } from "../../../systems/rng/rng";
import { GlyphComponent } from "../../components/display/GlyphComponent";
import { NameComponent } from "../../components/display/NameComponent";
import { MainHandComponent } from "../../components/equipment/MainHandComponent";
import { RemovableComponent } from "../../components/equipment/RemovableComponent";
import { DmgComponent } from "../../components/combat/DmgComponent";
import { DroppableComponent } from "../../components/interaction/DroppableComponent";
import { PickupableComponent } from "../../components/interaction/PickupableComponent";
import type { ItemFactory } from "../../Factory";

const DickEntity = getEntityCreator("DICK");

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
