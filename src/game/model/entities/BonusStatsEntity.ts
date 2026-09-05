import { getEntityCreator } from "../../../core/model/Entity";
import type { Factory } from "../Factory";

export const BonusStatsEntity = getEntityCreator("BONUS_STATS");

export const BonusStatsEntityFactory: Factory = {
  getDefault: () => {
    const bonusStats = BonusStatsEntity();

    return bonusStats;
  },
};
