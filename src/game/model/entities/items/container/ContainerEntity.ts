import { getEntityCreator, type Entity } from "../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../utils/colors"
import { DEFAULT_PLAYER_BACKPACK_SIZE } from "../../../../../utils/constants"
import type { Enum, EnumType } from "../../../../../utils/types/Enum"
import { getRng } from "../../../../systems/rng/rng"
import { ContainerComponent } from "../../../components/containers/ContainerComponent"
import { NestDepthComponent } from "../../../components/containers/NestDepthComponent"
import { SizeComponent } from "../../../components/containers/SizeComponent"
import { ColorComponent } from "../../../components/display/ColorComponent"
import { GlyphComponent } from "../../../components/display/GlyphComponent"
import { NameComponent } from "../../../components/display/NameComponent"
import { MainHandComponent } from "../../../components/equipment/MainHandComponent"
import { RemovableComponent } from "../../../components/equipment/RemovableComponent"
import { DroppableComponent } from "../../../components/interaction/DroppableComponent"
import { PickupableComponent } from "../../../components/interaction/PickupableComponent"
import type { ItemFactory } from "../../../Factory"

export const ContainerEntity = getEntityCreator("CONTAINER")

const ContainerVariants = {
  DEFAULT: "DEFAULT",
  BACKPACK: "BACKPACK",
  PLAYER_BACKPACK: "PLAYER_BACKPACK",
} as const satisfies Enum
type ContainerVariants = EnumType<typeof ContainerVariants>

type ContainerFactory = ItemFactory & {
  getBackpack: () => Entity
  getPlayerBackpack: () => Entity
}

export const ContainerEntityFactory: ContainerFactory = {
  getDefault() {
    const container = ContainerEntity()

    upsertComponents(
      container,
      NameComponent({ name: "Container" }),
      GlyphComponent({ glyph: "C" }),
      ContainerComponent(),
      SizeComponent({ size: getRng(container).range(2, 4) }),
      ColorComponent({ color: COLORS.TIER.COMMON }),
    )
    return container
  },

  getBackpack() {
    const backpack = ContainerEntity()

    upsertComponents(
      backpack,
      NameComponent({ name: "Backpack" }),
      GlyphComponent({ glyph: "b" }),
      ContainerComponent(),
      SizeComponent({ size: getRng(backpack).range(2, 4) }),
      NestDepthComponent({ nestDepth: getRng(backpack).range(1, 2) }),
      ColorComponent({ color: COLORS.TIER.COMMON }),
    )
    return backpack
  },

  getPlayerBackpack() {
    const backpack = ContainerEntity()

    upsertComponents(
      backpack,
      NameComponent({ name: "Backpack" }),
      GlyphComponent({ glyph: "*" }),
      ContainerComponent(),
      SizeComponent({ size: DEFAULT_PLAYER_BACKPACK_SIZE }),
      ColorComponent({ color: COLORS.TIER.COMMON }),
    )
    return backpack
  },

  getVariant(variant: ContainerVariants) {
    switch (variant) {
      case ContainerVariants.DEFAULT:
        return this.getDefault()
      case ContainerVariants.BACKPACK:
        return this.getBackpack()
      case ContainerVariants.PLAYER_BACKPACK:
        return this.getPlayerBackpack()
    }
  },

  setDroppable: (entity: Entity) => {
    upsertComponents(
      entity,
      DroppableComponent(),
      PickupableComponent(),
      RemovableComponent(),
      MainHandComponent(),
    )
  },
}
