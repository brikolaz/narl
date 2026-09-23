import {
  getEntityCreator,
  type Entity,
} from "../../../../../../core/model/Entity"
const addComponents = (bonusStats: Entity<"BONUS_STATS">): void => {
  void bonusStats
}
const addLoot = (bonusStats: Entity<"BONUS_STATS">): void => {
  void bonusStats
}
const addEq = (bonusStats: Entity<"BONUS_STATS">): void => {
  void bonusStats
}
export const BonusStatsEntity = getEntityCreator("BONUS_STATS", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
