import type { Entity } from "../../../../core/model/Entity"
import type { Factory } from "../../Factory"
import { BonusStatsEntity } from "./variants/BonusStats/BonusStatsEntity"
import type { BonusStatsEntityVariants } from "./variants/variants"
export const BonusStatsEntityFactory: Factory<BonusStatsEntityVariants> = {
  getDefault(): Entity {
    return BonusStatsEntity()
  },
}
