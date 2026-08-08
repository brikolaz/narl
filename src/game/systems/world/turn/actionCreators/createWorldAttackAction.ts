import type { Entity } from "../../../../../core/model/Entity";
import { isAdjacent } from "../../../../../utils/adjacent";
import { getPlayerEntity, getPlayerPosition } from "../../../../model/queries/player";
import type { Tile } from "../../../../state/state";
import { isHostile } from "../../../attack/hostililty";
import { WorldActionType, type WorldAction } from "../../types";

export const createWorldAttackAction = (
  mob: Entity,
  tile: Tile,
): WorldAction | undefined => {
  const mobPos = tile.position;
  const playerPos = getPlayerPosition();
  if (isHostile(mob) && isAdjacent(mobPos, playerPos)) {
    return {
      type: WorldActionType.ATTACK,
      sourceId: mob.id,
      targetId: getPlayerEntity().id
    };
  }
  return undefined;
};
