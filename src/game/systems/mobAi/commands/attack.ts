import type { Entity } from "../../../../core/model/Entity";
import { isAdjacent } from "../../../../utils/adjacent";
import { getPlayer } from "../../../model/queries/player";
import { getPosition } from "../../../model/queries/position";
import type { GameAction } from "../../actions/types";
import { isHostile } from "../../attack/hostililty";
import { WorldActionType } from "../../world/types";

export const canAttack = (mob: Entity) =>
  isHostile(mob) &&
  isAdjacent(getPosition(getPlayer()), getPosition(mob));

export const attack = (mob: Entity): GameAction | undefined => {
  const player = getPlayer();
  if (canAttack(mob)) {
    return {
      type: WorldActionType.ATTACK,
      sourceId: mob.id,
      targetId: player.id,
    };
  }
};
