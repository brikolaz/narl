import type { EntityProps } from "../../../../core/ecs/Entity";
import { NameComponent } from "../../components/NameComponent";
import { DmgComponent } from "../../components/DmgComponent";
import { GlyphComponent } from "../../components/GlyphComponent";
import { PickupableComponent } from "../../components/PickupableComponent";
import { ItemEntity } from "./ItemEntity";
import { MainHandComponent } from "../../components/eq/MainHandComponent";
import { addComponents } from "../../../../core/ecs/queries/component";
import type { Component } from "../../../../core/ecs/Component";
import { RNG } from "../../../systems/rng/rng";
import { DroppableComponent } from "../../components/DroppableComponent";

export type SwordEntityProps = EntityProps;

export class SwordEntity extends ItemEntity {
  constructor(props?: SwordEntityProps) {
    const glyph = new GlyphComponent({
      glyph: "/" as string,
    });
    const name = new NameComponent({ name: "Sword" });

    super({
      ...props,
      components: [
        ...(props?.components ?? []),
        glyph,
        name,
      ],
    });
  }
}

export class SwordEntityFactory {
  private static getBase(): SwordEntity {
    const sword = new SwordEntity();

    return sword;
  }

  static getDefault(): SwordEntity {
    const sword = this.getBase();

    const mainHand = new MainHandComponent();
    const dmg = new DmgComponent({ dmg: RNG.items.range(5, 8) });
    const pickupable = new PickupableComponent();
    const droppable = new DroppableComponent();
    addComponents(sword, ...([mainHand, dmg, pickupable, droppable] as Component[]));

    return sword;
  }
}
