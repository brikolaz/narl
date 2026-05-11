import { Entity, type EntityProps } from "../../../core/ecs/Entity";
import { PLAYER_SIGN } from "../../../utils/constants";
import { ExpComponent } from "../components/ExpComponent";
import { GlyphComponent } from "../components/GlyphComponent";
import { BackpackEntity } from "./items/BackpackEntity";
import { EqEntity } from "./eq/EqEntity";
import { ColorComponent } from "../components/ColorComponent";

export type PlayerEntityProps = EntityProps;

export class PlayerEntity extends Entity {
  constructor(props?: PlayerEntityProps) {
    const glyph = new GlyphComponent({
      glyph: PLAYER_SIGN as string,
    });
    const backpack = new BackpackEntity();
    const exp = new ExpComponent();
    const eq = new EqEntity();
    const color = new ColorComponent();

    super({
      components: [...(props?.components ?? []), glyph, exp, color],
      entities: [...(props?.entities ?? []), backpack, eq],
    });
  }
}
