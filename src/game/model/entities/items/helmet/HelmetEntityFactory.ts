import type { Component } from "../../../../../core/ecs/Component";
import { addComponents, upsertComponents } from "../../../../../core/ecs/queries/component";
import { RNG } from "../../../../systems/rng/rng";
import { NameComponent } from "../../../components/display/NameComponent";
import { HeadComponent } from "../../../components/eq/HeadComponent";
import { InspectDescComponent } from "../../../components/inspect/InspectDescComponent";
import { DefComponent } from "../../../components/items/DefComponent";
import { DroppableComponent } from "../../../components/items/DroppableComponent";
import { PickupableComponent } from "../../../components/items/PickupableComponent";
import { VariantComponent } from "../../../components/VariantComponent";
import { HelmetEntity, HelmetEntityVariants } from "./HelmetEntity";

export class HornedHelmetEntityFactory {
  private static addInspectDesc(item: HelmetEntity) {
    addComponents(
      item,
      new InspectDescComponent({ times: 5, text: "It has horns" }),
      new InspectDescComponent({ times: 10, text: "Looks horny" }),
    );
  }

  private static getBase(): HelmetEntity {
    const hornedHelmet = new HelmetEntity();
    this.addInspectDesc(hornedHelmet);

    return hornedHelmet;
  }

  static getDefault(): HelmetEntity {
    const hornedHelmet = this.getBase();

    const head = new HeadComponent();
    const def = new DefComponent({ def: RNG.items.range(3, 4) });
    const pickupable = new PickupableComponent();
    const droppable = new DroppableComponent();
    const variant = new VariantComponent({
      variant: HelmetEntityVariants.HELMET,
    });
    addComponents(
      hornedHelmet,
      ...([head, def, pickupable, droppable, variant] as Component[]),
    );

    return hornedHelmet;
  }

  static getHornedHelmet() {
    const helmet = this.getDefault();
    const variant = new VariantComponent({
      variant: HelmetEntityVariants.HORNED_HELMET,
    });
    const name = new NameComponent({
      name: HelmetEntityVariants.HORNED_HELMET,
    });
    upsertComponents(helmet, variant, name);
    return helmet;
  }
}
