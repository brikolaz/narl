import type { Entity } from "../../../../core/model/Entity"
import type { Factory } from "../../Factory"
import { WallEntity } from "./variants/Wall/WallEntity"
import type { WallEntityVariants } from "./variants/variants"
export const WallEntityFactory: Factory<WallEntityVariants> = {
  getDefault(): Entity {
    return WallEntity()
  },
}
