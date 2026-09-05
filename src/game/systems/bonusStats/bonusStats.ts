import { EntityRole, type Entity } from "../../../core/model/Entity";
import { getEntityByRole } from "../../../core/model/queries/entities/get";
import { getEqItems } from "../../model/queries/eq";

export const getBonusStats = (entity: Entity): Entity | undefined => {
  return getEntityByRole(entity, EntityRole.BONUS_STATS);
};

export const getAllBonusStats = (entity: Entity): Entity[] => {
  return getEqItems(entity)
    .flatMap(getBonusStats)
    .filter((bonusStats) => bonusStats !== undefined);
};
