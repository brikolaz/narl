import { Entity, type EntityProps } from "../../../core/ecs/Entity";
import { addEntities } from "../../../core/ecs/queries/entities";
import {
  DEFAULT_PLAYER_BACKPACK_SIZE,
  DEFAULT_PLAYER_GLYPH,
} from "../../../utils/constants";
import { ColorComponent } from "../components/display/ColorComponent";
import { GlyphComponent } from "../components/display/GlyphComponent";
import { NameComponent } from "../components/display/NameComponent";
import { ExpComponent } from "../components/mobs/ExpComponent";
import { HpComponent } from "../components/mobs/HpComponent";
import { AmuletSlotEntity } from "./eq/AmuletSlotEntity";
import { ArmorSlotEntity } from "./eq/ArmorSlotEntity";
import { BootsSlotEntity } from "./eq/BootsSlotEntity";
import { EqEntity } from "./eq/EqEntity";
import { HeadSlotEntity } from "./eq/HeadSlotEntity";
import { MainHandSlotEntity } from "./eq/MainHandSlotEntity";
import { OffhandSlotEntity } from "./eq/OffhandSlotEntity";
import { PantsSlotEntity } from "./eq/PantsSlotEntity";
import { RingSlotEntity } from "./eq/RingSlotEntity";
import { BackpackEntityFactory } from "./items/backpack/BackpackEntityFactory";

export type PlayerEntityProps = EntityProps;

export class PlayerEntity extends Entity {
  constructor(props?: PlayerEntityProps) {
    const glyph = new GlyphComponent({
      glyph: DEFAULT_PLAYER_GLYPH as string,
    });
    const backpack = BackpackEntityFactory.getPlayerBackpack(
      DEFAULT_PLAYER_BACKPACK_SIZE,
    );
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
      new HeadSlotEntity(),
      new AmuletSlotEntity(),
      new MainHandSlotEntity(),
      new ArmorSlotEntity(),
      new OffhandSlotEntity(),
      new RingSlotEntity(),
      new PantsSlotEntity(),
      new BootsSlotEntity(),
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
