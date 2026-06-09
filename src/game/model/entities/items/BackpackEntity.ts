import type { Component } from "../../../../core/ecs/Component";
import { type EntityProps } from "../../../../core/ecs/Entity";
import { addComponents } from "../../../../core/ecs/queries/component";
import { addEntities } from "../../../../core/ecs/queries/entities";
import { getDummyArray } from "../../../../utils";
import { DEFAULT_BACKPACK_SIZE } from "../../../../utils/constants";
import { RNG } from "../../../systems/rng/rng";
import { ContainerComponent } from "../../components/ContainerComponent";
import { MainHandComponent } from "../../components/eq/MainHandComponent";
import { GlyphComponent } from "../../components/GlyphComponent";
import { NameComponent } from "../../components/NameComponent";
import { NestDepthComponent } from "../../components/NestDepthComponent";
import { PickupableComponent } from "../../components/PickupableComponent";
import { SizeComponent } from "../../components/SizeComponent";
import { ItemEntity } from "./ItemEntity";
import { PlaceholderEntity } from "./PlaceholderItemEntity";

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
    ];
    super({
      components: [...(props.components ?? []), ...components],
      entities: props.entities ?? [],
    });
  }
}

export class BackpackEntityFactory {
  private static getBase(): BackpackEntity {
    const backpack = new BackpackEntity();

    return backpack;
  }

  private static addPlaceholders(
    backpack: BackpackEntity,
    { size }: SizeComponent,
  ): void {
    const entities = getDummyArray(size).map(() => new PlaceholderEntity());
    addEntities(backpack, ...entities);
  }
  static getPlayerBackpack(): BackpackEntity {
    const backpack = this.getBase();

    const size = new SizeComponent({
      size: DEFAULT_BACKPACK_SIZE,
    });
    addComponents(backpack, size);
        this.addPlaceholders(backpack, size);

    return backpack;
  }

  static getDefault(): BackpackEntity {
    const backpack = this.getBase();

    const size = new SizeComponent({
      size: RNG.items.range(2, 4),
    });
  
    const nestDepth = new NestDepthComponent({
      nestDepth: RNG.items.range(1, 2),
    });
    const mainHand = new MainHandComponent();
    const pickup = new PickupableComponent();
    addComponents(
      backpack,
      ...([size, nestDepth, mainHand, pickup] as Component[]),
    );
    this.addPlaceholders(backpack, size);

    return backpack;
  }
}
