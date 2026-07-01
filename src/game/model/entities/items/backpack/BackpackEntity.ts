import { type EntityProps } from "../../../../../core/ecs/Entity";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { ItemEntity } from "../ItemEntity";

export type BackpackEntityProps = {
  size?: number;
  name?: string;
  dmg?: number;
} & EntityProps;

const BACKPACK_ENTITY_NAME = "Backpack";

export class BackpackEntity extends ItemEntity {
  constructor(props: BackpackEntityProps = {}) {
    const components = [
      new NameComponent({ name: props?.name ?? BACKPACK_ENTITY_NAME }),
      new GlyphComponent({ glyph: "*" }),
      new ContainerComponent(),
      new RemovableComponent(),
    ];
    super({
      components: [...(props.components ?? []), ...components],
      entities: props.entities ?? [],
    });
  }
}
