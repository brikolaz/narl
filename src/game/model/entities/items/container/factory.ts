import type { EntityByVariant } from "../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../core/model/queries/components/add"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { DroppableComponent } from "../../../components/interaction/DroppableComponent"
import { BackpackEntity } from "./variants/Backpack/BackpackEntity"
import { ContainerEntity } from "./variants/Container/ContainerEntity"
import { PlayerBackpackEntity } from "./variants/PlayerBackpack/PlayerBackpackEntity"
import type { ContainerEntityVariants } from "./variants/variants"

class ContainerFactory extends BaseItemFactory<ContainerEntityVariants> {
  getDefault(): ReturnType<typeof ContainerEntity> {
    return ContainerEntity()
  }
  getBackpack(): ReturnType<typeof BackpackEntity> {
    return BackpackEntity()
  }
  getPlayerBackpack(): ReturnType<typeof PlayerBackpackEntity> {
    return PlayerBackpackEntity()
  }
  getVariant(
    variant: ContainerEntityVariants,
  ): EntityByVariant<ContainerEntityVariants> {
    switch (variant) {
      case BackpackEntity.type:
        return BackpackEntity()
      case PlayerBackpackEntity.type:
        return PlayerBackpackEntity()
      default:
        return this.getDefault()
    }
  }
  setDroppable(entity: EntityByVariant<ContainerEntityVariants>): void {
    upsertComponents(entity, DroppableComponent())
  }
}

export const ContainerEntityFactory = new ContainerFactory()
