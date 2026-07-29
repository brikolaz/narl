import { getEntityCreator, type Entity } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { DEFAULT_PLAYER_BACKPACK_SIZE } from "../../../../../utils/constants";
import type { Enum, EnumType } from "../../../../../utils/types/Enum";
import { getRng } from "../../../../systems/rng/rng";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { NestDepthComponent } from "../../../components/containers/NestDepthComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { MainHandComponent } from "../../../components/eq/MainHandComponent";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { DroppableComponent } from "../../../components/items/DroppableComponent";
import { PickupableComponent } from "../../../components/items/PickupableComponent";
import type { ItemFactory } from "../../../Factory";

export const ContainerEntity = getEntityCreator("CONTAINER");

const ContainerVariants = {
  DEFAULT: "DEFAULT",
  BACKPACK: "BACKPACK",
  PLAYER_BACKPACK: "PLAYER_BACKPACK",
} as const satisfies Enum;
type ContainerVariants = EnumType<typeof ContainerVariants>;

type ContainerFactory = ItemFactory & {
  getBackpack: () => Entity;
  getPlayerBackpack: () => Entity;
};

export const ContainerEntityFactory: ContainerFactory = {
  getDefault() {
    const container = ContainerEntity();

    upsertComponents(
      container,
      NameComponent({ name: "Container" }),
      GlyphComponent({ glyph: "C" }),
      ContainerComponent(),
      SizeComponent({ size: getRng(container).range(2, 4) }),
    );
    return container;
  },

  getBackpack() {
    const backpack = ContainerEntity();

    upsertComponents(
      backpack,
      NameComponent({ name: "Backpack" }),
      GlyphComponent({ glyph: "*" }),
      ContainerComponent(),
      SizeComponent({ size: getRng(backpack).range(2, 4) }),
      NestDepthComponent({ nestDepth: getRng(backpack).range(1, 2) }),
    );
    return backpack;
  },

  getPlayerBackpack() {
    const backpack = ContainerEntity();

    upsertComponents(
      backpack,
      NameComponent({ name: "Backpack" }),
      GlyphComponent({ glyph: "*" }),
      ContainerComponent(),
      SizeComponent({ size: DEFAULT_PLAYER_BACKPACK_SIZE }),
    );
    return backpack;
  },

  getVariant(variant: ContainerVariants) {
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
    upsertComponents(
      entity,
      DroppableComponent(),
      PickupableComponent(),
      RemovableComponent(),
      MainHandComponent(),
    );
  },
};
