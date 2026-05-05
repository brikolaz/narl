import { Entity, type EntityProps } from "../../../../core/ecs/Entity";
import { DEFAULT_BACKPACK_SIZE } from "../../../../utils/constants";
import { GlyphComponent } from "../../components";
import { NameComponent } from "../../components/AppearanceComponent copy";
import { SizeComponent } from "../../components/SizeComponent";
import { ItemEntity } from "./ItemEntity";

export type BackpackEntityProps = {
  size?: number;
} & EntityProps;

// in the future it may be needed to make it extend some generic ContainerComponent
export class BackpackEntity extends ItemEntity {
  static name = "BackpackEntity";
  constructor(props: BackpackEntityProps = {}) {
    const name = new NameComponent({ name: "Backpack" });
    const glyph = new GlyphComponent({ glyph: "*" });
    const size = new SizeComponent({
      size: props.size ?? DEFAULT_BACKPACK_SIZE,
    });
    super({ components: [size, glyph, name] });
  }
}
