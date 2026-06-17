import type { Component } from "../../../../core/ecs/Component";
import type { EntityProps } from "../../../../core/ecs/Entity";
import { addComponents } from "../../../../core/ecs/queries/component";
import { RNG } from "../../../systems/rng/rng";
import { DefComponent } from "../../components/DefComponent";
import { DroppableComponent } from "../../components/DroppableComponent";
import { HeadComponent } from "../../components/eq/HeadComponent";
import { GlyphComponent } from "../../components/GlyphComponent";
import { NameComponent } from "../../components/NameComponent";
import { PickupableComponent } from "../../components/PickupableComponent";
import { ItemEntity } from "./ItemEntity";

export type HornedHelmetEntityProps = EntityProps;

export class HornedHelmetEntity extends ItemEntity {
  constructor(props?: HornedHelmetEntityProps) {
    const glyph = new GlyphComponent({
      glyph: "H" as string,
    });
    const name = new NameComponent({ name: "Horned Helmet" });

    super({
      ...props,
      components: [...(props?.components ?? []), glyph, name],
    });
  }
}

export class HornedHelmetEntityFactory {
  private static getBase(): HornedHelmetEntity {
    const hornedHelmet = new HornedHelmetEntity();

    return hornedHelmet;
  }

  static getDefault(): HornedHelmetEntity {
    const hornedHelmet = this.getBase();

    const head = new HeadComponent();
    const def = new DefComponent({ def: RNG.items.range(3, 4) });
    const pickupable = new PickupableComponent();
    const droppable = new DroppableComponent();
    addComponents(
      hornedHelmet,
      ...([head, def, pickupable, droppable] as Component[]),
    );

    return hornedHelmet;
  }
}
