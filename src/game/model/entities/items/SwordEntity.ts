import type { EntityProps } from "../../../../core/ecs/Entity";
import { NameComponent } from "../../components/display/NameComponent";
import { DmgComponent } from "../../components/items/DmgComponent";
import { GlyphComponent } from "../../components/display/GlyphComponent";
import { PickupableComponent } from "../../components/items/PickupableComponent";
import { ItemEntity } from "./ItemEntity";
import { MainHandComponent } from "../../components/eq/MainHandComponent";
import { addComponents } from "../../../../core/ecs/queries/component";
import type { Component } from "../../../../core/ecs/Component";
import { RNG } from "../../../systems/rng/rng";
import { DroppableComponent } from "../../components/items/DroppableComponent";
import { RemovableComponent } from "../../components/eq/RemovableComponent";

export type SwordEntityProps = EntityProps;

export class SwordEntity extends ItemEntity {
  constructor(props?: SwordEntityProps) {
    const glyph = new GlyphComponent({
      glyph: "/" as string,
    });
    const name = new NameComponent({ name: "Sword" });
    const removable = new RemovableComponent();
    super({
      ...props,
      components: [...(props?.components ?? []), glyph, name, removable],
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
    addComponents(
      sword,
      ...([mainHand, dmg, pickupable, droppable] as Component[]),
    );

    return sword;
  }
}
