import { getEntityCreator, type Entity } from "../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../core/model/queries/components/add"
import { COLORS } from "../../../../../utils/colors"
import { DEFAULT_PLAYER_BACKPACK_SIZE } from "../../../../../utils/constants"
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
export const BackpackEntity = getEntityCreator("BACKPACK")
export const PlayerBackpackEntity = getEntityCreator("PLAYER_BACKPACK")

type ContainerEntityVariants =
  | typeof ContainerEntity.type
  | typeof BackpackEntity.type
  | typeof PlayerBackpackEntity.type

type ContainerFactory = ItemFactory<ContainerEntityVariants> & {
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
      ColorComponent({ color: COLORS.tier.common }),
    )
    return container
  },

  getBackpack() {
    const backpack = BackpackEntity()

    upsertComponents(
      backpack,
      NameComponent({ name: "Backpack" }),
      GlyphComponent({ glyph: "b" }),
      ContainerComponent(),
      SizeComponent({ size: getRng(backpack).range(2, 4) }),
      NestDepthComponent({ nestDepth: getRng(backpack).range(1, 2) }),
      ColorComponent({ color: COLORS.tier.common }),
    )
    return backpack
  },

  getPlayerBackpack() {
    const backpack = PlayerBackpackEntity()

    upsertComponents(
      backpack,
      NameComponent({ name: "Backpack" }),
      GlyphComponent({ glyph: "*" }),
      ContainerComponent(),
      SizeComponent({ size: DEFAULT_PLAYER_BACKPACK_SIZE }),
      ColorComponent({ color: COLORS.tier.common }),
    )
    return backpack
  },

  getVariant(variant) {
    switch (variant) {
      case ContainerEntity.type:
        return this.getDefault()
      case BackpackEntity.type:
        return this.getBackpack()
      case PlayerBackpackEntity.type:
        return this.getPlayerBackpack()
    }
    throw new Error("Unknown container variant")
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
