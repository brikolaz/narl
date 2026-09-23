import type { Entity } from "../../../../core/model/Entity"
import type { Factory } from "../../Factory"
import { FloorEntity } from "./variants/Floor/FloorEntity"
import type { FloorEntityVariants } from "./variants/variants"
export const FloorEntityFactory: Factory<FloorEntityVariants> = {
  getDefault(): Entity {
    return FloorEntity()
  },
}
