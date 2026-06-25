import type { Entity } from "../../../../../core/ecs/Entity";
import { isAdjacent } from "../../../../../utils/adjacent";
import { getPlayerPosition } from "../../../../model/queries/player";
import type { GameState, Tile } from "../../../../state/state";
import { isHostile } from "../../../attack/hostililty";
import { WorldActionType, type WorldAction } from "../../types";

export const createWorldAttackAction = (
  mob: Entity,
  tile: Tile,
  gameState: GameState,
): WorldAction | undefined => {
  const mobPos = tile.position;
  const playerPos = getPlayerPosition(gameState);
  if (isHostile(mob) && isAdjacent(mobPos, playerPos)) {
    return {
      type: WorldActionType.ATTACK,
      sourcePos: mobPos,
      mobId: mob.id,
    };
  }
  return undefined;
};
