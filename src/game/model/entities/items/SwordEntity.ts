import { getEntityCreator, type Entity } from "../../../../core/model/Entity";
import { upsertComponents } from "../../../../core/model/queries/components/add";
import type { Enum, EnumType } from "../../../../utils/types/Enum";
import { getRng } from "../../../systems/rng/rng";
import { GlyphComponent } from "../../components/display/GlyphComponent";
import { NameComponent } from "../../components/display/NameComponent";
import { MainHandComponent } from "../../components/eq/MainHandComponent";
import { OffhandComponent } from "../../components/eq/OffhandComponent";
import { RemovableComponent } from "../../components/eq/RemovableComponent";
import { DmgComponent } from "../../components/items/DmgComponent";
import { DroppableComponent } from "../../components/items/DroppableComponent";
import { PickupableComponent } from "../../components/items/PickupableComponent";
import { PierceComponent } from "../../components/PierceComponent";
import type { ItemFactory } from "../../Factory";

export const SwordEntityVariants = {
  DEFAULT: "Sword",
  LONG_SWORD: "Long Sword",
} as const satisfies Enum;
type SwordEntityVariants = EnumType<typeof SwordEntityVariants>;


export const SwordEntity = getEntityCreator("SWORD");

type SwordEntityFactory = ItemFactory & {
  getLongSword: () => Entity;
}

export const SwordEntityFactory: SwordEntityFactory = {
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
  getLongSword: () => {
    const longSword = SwordEntity();
    const minDmg = getRng(longSword).range(5, 6);
    
    upsertComponents(
      longSword,
      GlyphComponent({
        glyph: "/" as string,
      }),
      NameComponent({ name: "Long Sword" }),
      RemovableComponent(),
      MainHandComponent(),
      OffhandComponent(),
      DmgComponent({ min: minDmg, max: minDmg + 3 }),
      PierceComponent({ pierce: 2 }),
      PickupableComponent(),
      DroppableComponent(),
    );

    return longSword;
  },
  getVariant: (variant: SwordEntityVariants) => {
    switch(variant) {
      case SwordEntityVariants.LONG_SWORD:
        return SwordEntityFactory.getLongSword();
      default:
        return SwordEntityFactory.getDefault()
    }
  }
};
