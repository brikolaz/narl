import { EntityRole, type Entity } from "../../../core/model/Entity";
import { getEntityByRole } from "../../../core/model/queries/entities/get";
import { getEqItems } from "../../model/queries/eq";
import { getDmgMod } from "../attack/dmg";

export const getBonusStats = (entity: Entity): Entity | undefined => {
  return getEntityByRole(entity, EntityRole.BONUS_STATS);
};

const getAllBonusStats = (entity: Entity): Entity[] => {
  return getEqItems(entity)
    .flatMap(getBonusStats)
    .filter((bonusStats) => bonusStats !== undefined);
};

export const getBonusDmgMod = (entity: Entity): number => {
  const bonusStats = getAllBonusStats(entity);
    return bonusStats.reduce(
    (modifier, stats) => modifier * getDmgMod(stats),
    1,
  );
}
