import { getEntityCreator } from "../../../core/model/Entity"
import type { Factory } from "../Factory"

const BonusStatsEntity = getEntityCreator("BONUS_STATS")
type BonusStatsEntityVariants = typeof BonusStatsEntity.type

export const BonusStatsEntityFactory: Factory<BonusStatsEntityVariants> = {
  getDefault: () => {
    const bonusStats = BonusStatsEntity()

    return bonusStats
  },
}
