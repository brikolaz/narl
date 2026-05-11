import { Entity, type EntityProps } from "../../../../core/ecs/Entity";
import { NameComponent } from "../../components/AppearanceComponent copy";
import { ColorComponent } from "../../components/ColorComponent";
import { GlyphComponent } from "../../components/GlyphComponent";
import { PeacefulComponent } from "../../components/mobs/PeacefulComponent";

export type MobEntityProps = {
  name: string;
  glyph: string;
} & EntityProps;

export abstract class MobEntity extends Entity {
  constructor(props: MobEntityProps) {
    const glyph = new GlyphComponent({
      glyph: props.glyph,
    });
    const name = new NameComponent({ name: props.name });
    const peaceful = new PeacefulComponent();
    const color = new ColorComponent();

    super({
      ...props,
      components: [...(props.components ?? []), glyph, name, peaceful, color],
    });
  }
}
