import { Entity, type EntityProps } from "../../../core/ecs/Entity";
import { PLAYER_SIGN } from "../../../utils/constants";
import { ExpComponent } from "../components/mobs/ExpComponent";
import { GlyphComponent } from "../components/display/GlyphComponent";
import { BackpackEntityFactory } from "./items/BackpackEntity";
import { EqEntity } from "./eq/EqEntity";
import { ColorComponent } from "../components/display/ColorComponent";
import { NameComponent } from "../components/display/NameComponent";
import { HpComponent } from "../components/mobs/HpComponent";
import { MainHandSlotEntity } from "./eq/MainHandSlotEntity";
import { HeadSlotEntity } from "./eq/HeadSlotEntity";
import { PantsSlotEntity } from "./eq/PantsSlotEntity";
import { addEntities } from "../../../core/ecs/queries/entities";

export type PlayerEntityProps = EntityProps;

export class PlayerEntity extends Entity {
  constructor(props?: PlayerEntityProps) {
    const glyph = new GlyphComponent({
      glyph: PLAYER_SIGN as string,
    });
    const backpack = BackpackEntityFactory.getPlayerBackpack();
    const exp = new ExpComponent();

    const color = new ColorComponent();
    const name = new NameComponent({ name: "Player" });
    const hp = new HpComponent({ hp: 20 });

    super({
      components: [...(props?.components ?? []), glyph, exp, color, name, hp],
      entities: [...(props?.entities ?? []), backpack],
    });
  }
}

export class PlayerEntityFactory {
  private static getBase() {
    const base = new PlayerEntity();
    return base;
  }

  private static getEq() {
    const entities = [
      new MainHandSlotEntity(),
      new HeadSlotEntity(),
      new PantsSlotEntity(),
    ];
    const eq = new EqEntity({ entities });
    return eq;
  }

  static getDefault() {
    const player = this.getBase();
    const eq = this.getEq();
    addEntities(player, eq);
    return player;
  }
}
