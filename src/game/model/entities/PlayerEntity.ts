import { Entity, type EntityProps } from "../../../core/ecs/Entity";
import { PLAYER_SIGN } from "../../../utils/constants";
import { GlyphComponent } from "../components/GlyphComponent";
import { BackpackEntity } from "./BackpackEntity";

export type PlayerEntityProps = EntityProps;

export class PlayerEntity extends Entity {
  constructor(props?: PlayerEntityProps) {
    const glyph = new GlyphComponent({
      glyph: PLAYER_SIGN as string,
    });
    const backpack = new BackpackEntity();
    super({
      components: [...(props?.components ?? []), glyph],
      entities: [...(props?.entities ?? []), backpack],
    });
  }
}
