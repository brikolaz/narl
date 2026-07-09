import {
  getEntityCreator,
  EntityRole,
  type Entity,
} from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { getComponentByType } from "../../../../../core/ecs/queries/components/get";
import { addRoleEntities } from "../../../../../core/ecs/queries/entities/add";
import type { Symbols } from "../../../../../core/ecs/Symbols";
import { DEFAULT_PLAYER_BACKPACK_SIZE } from "../../../../../utils/constants";
import { getDummyArray } from "../../../../../utils/getDummyArray";
import { RNG } from "../../../../systems/rng/rng";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { NestDepthComponent } from "../../../components/containers/NestDepthComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { MainHandComponent } from "../../../components/eq/MainHandComponent";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { DroppableComponent } from "../../../components/items/DroppableComponent";
import { PickupableComponent } from "../../../components/items/PickupableComponent";
import { VariantComponent } from "../../../components/VariantComponent";
import type { ItemFactory } from "../../../Factory";
import { PlaceholderEntityFactory } from "../PlaceholderItemEntity";

export const ContainerEntity = getEntityCreator("CONTAINER");

const ContainerVariants = {
  DEFAULT: Symbol("DEFAULT"),
  BACKPACK: Symbol("BACKPACK"),
  PLAYER_BACKPACK: Symbol("PLAYER_BACKPACK"),
} as const satisfies Symbols;

type ContainerFactory = ItemFactory & {
  getBackpack: () => Entity;
  getPlayerBackpack: () => Entity;
};

const addPlaceholders = (container: Entity) => {
  const sizeComponent = getComponentByType(container, SizeComponent);
  if (!sizeComponent) {
    throw new Error("No size component");
  }

  addRoleEntities(container, {
    [EntityRole.ITEM]: getDummyArray(sizeComponent.size).map(() =>
      PlaceholderEntityFactory.getDefault(),
    ),
  });
};

export const ContainerEntityFactory: ContainerFactory = {
  getDefault() {
    const container = ContainerEntity();

    addComponents(
      container,
      NameComponent({ name: "Container" }),
      GlyphComponent({ glyph: "C" }),
      ContainerComponent(),
      SizeComponent({ size: RNG.items.range(2, 4) }),
      VariantComponent({ variant: ContainerVariants.DEFAULT }),
    );

    return container;
  },

  getBackpack() {
    const backpack = ContainerEntity();

    addComponents(
      backpack,
      NameComponent({ name: "Backpack" }),
      GlyphComponent({ glyph: "*" }),
      NestDepthComponent({ nestDepth: RNG.items.range(1, 2) }),
      VariantComponent({ variant: ContainerVariants.BACKPACK }),
    );
    addPlaceholders(backpack);

    return backpack;
  },

  getPlayerBackpack() {
    const backpack = ContainerEntity();

    addComponents(
      backpack,
      NameComponent({ name: "Backpack" }),
      GlyphComponent({ glyph: "*" }),
      SizeComponent({ size: DEFAULT_PLAYER_BACKPACK_SIZE }),
      VariantComponent({ variant: ContainerVariants.PLAYER_BACKPACK }),
    );
    addPlaceholders(backpack);

    return backpack;
  },

  getVariant(variant: symbol) {
    switch (variant) {
      case ContainerVariants.BACKPACK:
        return this.getBackpack();
      case ContainerVariants.PLAYER_BACKPACK:
        return this.getPlayerBackpack();
      default:
        return this.getDefault();
    }
  },

  setDroppable: (entity: Entity) => {
    addComponents(
      entity,
      DroppableComponent(),
      PickupableComponent(),
      RemovableComponent(),
      MainHandComponent(),
    );
  },
};
