import type { Entity } from "../../../../../core/model/Entity"
import { BaseItemFactory } from "../../../BaseItemFactory"
import { BackpackEntity } from "./variants/Backpack/BackpackEntity"
import { ContainerEntity } from "./variants/Container/ContainerEntity"
import { PlayerBackpackEntity } from "./variants/PlayerBackpack/PlayerBackpackEntity"
import type { ContainerEntityVariants } from "./variants/variants"

class ContainerFactory extends BaseItemFactory<ContainerEntityVariants> {
  getDefault(): Entity {
    return ContainerEntity()
  }
  getBackpack(): Entity {
    return BackpackEntity()
  }
  getPlayerBackpack(): Entity {
    return PlayerBackpackEntity()
  }
  getVariant(variant: ContainerEntityVariants): Entity {
    switch (variant) {
      case BackpackEntity.type:
        return BackpackEntity()
      case PlayerBackpackEntity.type:
        return PlayerBackpackEntity()
      default:
        return this.getDefault()
    }
  }
}

export const ContainerEntityFactory = new ContainerFactory()
