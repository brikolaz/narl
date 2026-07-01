import type { EntityProps } from "../../../../../core/ecs/Entity";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { ItemEntity } from "../ItemEntity";

export type RingEntityProps = EntityProps;

export enum RingEntityVariants {
  RING = "Ring",
}

export class RingEntity extends ItemEntity {
  constructor(props?: RingEntityProps) {
    const glyph = new GlyphComponent({
      glyph: "o",
    });
    const name = new NameComponent({ name: RingEntityVariants.RING });
    const removable = new RemovableComponent();
    super({
      ...props,
      components: [...(props?.components ?? []), glyph, name, removable],
    });
  }
}
