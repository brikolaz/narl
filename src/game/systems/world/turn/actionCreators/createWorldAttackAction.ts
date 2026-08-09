import type { Entity } from "../../../../../core/model/Entity";
import { isAdjacent } from "../../../../../utils/adjacent";
import { getPlayer } from "../../../../model/queries/player";
import { getPosition } from "../../../../model/queries/position";
import type { Tile } from "../../../../state/state";
import { isHostile } from "../../../attack/hostililty";
import { WorldActionType, type WorldAction } from "../../types";

export const createWorldAttackAction = (
  mob: Entity,
  tile: Tile,
): WorldAction | undefined => {
  const mobPos = tile.position;
  const playerPos = getPosition(getPlayer());
  if (isHostile(mob) && isAdjacent(mobPos, playerPos)) {
    return {
      type: WorldActionType.ATTACK,
      sourceId: mob.id,
      targetId: getPlayer().id
    };
  }
  return undefined;
};
