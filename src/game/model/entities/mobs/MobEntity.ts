import { Entity, type EntityProps } from "../../../../core/ecs/Entity";
import { NameComponent } from "../../components/display/NameComponent";
import { ColorComponent } from "../../components/display/ColorComponent";
import { GlyphComponent } from "../../components/display/GlyphComponent";
import { EqEntity } from "../eq/EqEntity";

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
    const color = new ColorComponent();
    const eq = new EqEntity()

    super({
      ...props,
      components: [...(props.components ?? []), glyph, name, color],
    });
  }
}
