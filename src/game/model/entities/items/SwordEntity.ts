import type { EntityProps } from "../../../../core/ecs/Entity";
import { MainHandComponent } from "../../components";
import { NameComponent } from "../../components/AppearanceComponent copy";
import { DmgComponent } from "../../components/DmgComponent";
import { GlyphComponent } from "../../components/GlyphComponent";
import { PickupableComponent } from "../../components/PickupableComponent";
import { ItemEntity } from "./ItemEntity";

export type SwordEntityProps = EntityProps;

export class SwordEntity extends ItemEntity {
  constructor(props?: SwordEntityProps) {
    const glyph = new GlyphComponent({
      glyph: "/" as string,
    });
    const mainHand = new MainHandComponent();
    const name = new NameComponent({ name: "Sword" });
    const dmg = new DmgComponent({ dmg: 5 });
    const pickupable = new PickupableComponent();

    super({
      ...props,
      components: [
        ...(props?.components ?? []),
        glyph,
        mainHand,
        name,
        dmg,
        pickupable,
      ],
    });
  }
}
