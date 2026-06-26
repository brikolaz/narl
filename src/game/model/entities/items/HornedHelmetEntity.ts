import type { Component } from "../../../../core/ecs/Component";
import type { EntityProps } from "../../../../core/ecs/Entity";
import {
  addComponents,
  upsertComponents,
} from "../../../../core/ecs/queries/component";
import { COLORS } from "../../../../utils/colors";
import { RNG } from "../../../systems/rng/rng";
import { ColorComponent } from "../../components/display/ColorComponent";
import { GlyphComponent } from "../../components/display/GlyphComponent";
import { NameComponent } from "../../components/display/NameComponent";
import { HeadComponent } from "../../components/eq/HeadComponent";
import { PantsComponent } from "../../components/eq/PantsComponent";
import { InspectDescComponent } from "../../components/inspect/InspectDescComponent";
import { CursedComponent } from "../../components/items/CursedComponent";
import { DefComponent } from "../../components/items/DefComponent";
import { DroppableComponent } from "../../components/items/DroppableComponent";
import { PickupableComponent } from "../../components/items/PickupableComponent";
import { isCursed } from "../../queries/curse";
import { getInspectedTimes } from "../../queries/inspect";
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
  private static addInspectDesc(item: HornedHelmetEntity) {
    addComponents(
      item,
      new InspectDescComponent({ times: 5, text: "It has horns" }),
      new InspectDescComponent({ times: 10, text: "Looks horny" }),
    );
  }

  private static getBase(): HornedHelmetEntity {
    const hornedHelmet = new HornedHelmetEntity();
    this.addInspectDesc(hornedHelmet);

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

  static curse(item: HornedHelmetEntity): boolean {
    const wasCursed = isCursed(item);
    if (wasCursed) {
      return false;
    }
    const components = [
      new CursedComponent(),
      new ColorComponent({ color: COLORS.CURSED }),
      new PantsComponent(),
    ];
    upsertComponents(item, ...components);
    return true;
  }

  static shouldBeCursed(item: HornedHelmetEntity): boolean {
    const inspected = getInspectedTimes(item);
    return inspected >= 10;
  }
}
