import { type EntityProps } from "../../../../core/ecs/Entity";
import { DEFAULT_BACKPACK_SIZE } from "../../../../utils/constants";
import { NameComponent } from "../../components/NameComponent";
import { ContainerComponent } from "../../components/ContainerComponent";
import { DmgComponent } from "../../components/DmgComponent";
import { EquippableComponent } from "../../components/EquippableComponent";
import { SizeComponent } from "../../components/SizeComponent";
import { ItemEntity } from "./ItemEntity";
import { GlyphComponent } from "../../components/GlyphComponent";
import { MainHandComponent } from "../../components/eq/MainHandComponent";
import { NestDepthComponent } from "../../components/NestDepthComponent";

export type BackpackEntityProps = {
  size?: number;
  name?: string;
  dmg?: number;
} & EntityProps;

export class BackpackEntity extends ItemEntity {
  constructor(props: BackpackEntityProps = {}) {
    const components = [
      new NameComponent({ name: props?.name ?? "Backpack" }),
      new GlyphComponent({ glyph: "*" }),
      new SizeComponent({
        size: props.size ?? DEFAULT_BACKPACK_SIZE,
      }),
      new ContainerComponent(),
      new NestDepthComponent({ nestDepth: 2 }),
    ];
    if (props.dmg) {
      components.push(
        new DmgComponent({ dmg: props.dmg }),
        new MainHandComponent(),
        new EquippableComponent(),
      );
    }
    super({
      components: [...(props.components ?? []), ...components],
      entities: props.entities ?? [],
    });
  }
}
