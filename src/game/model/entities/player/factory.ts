import type { Entity } from "../../../../core/model/Entity"
import type { Factory } from "../../Factory"
import { PlayerEntity } from "./variants/Player/PlayerEntity"
import type { PlayerEntityVariants } from "./variants/variants"
export const PlayerEntityFactory: Factory<PlayerEntityVariants> = {
  getDefault(): Entity {
    return PlayerEntity()
  },
}
