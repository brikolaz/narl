import type { Entity } from "../../../../core/model/Entity";
import { assert } from "../../../../utils/assert";
import { getPlayerEntity } from "../../../model/queries/player";
import type { GameAction } from "../../actions/types";
import { isHostile } from "../../attack/hostililty";
import { getDirectionTo } from "../../movement/position";
import { WorldActionType } from "../../world/types";
import { isAware } from "../aggro";
import { inFov } from "../fov";
import { isMovable } from "../move";
import { hasPath } from "../path";
import { canAttack } from "./attack";

const canMove = (mob: Entity) => {
  const player = getPlayerEntity();

  return (
    !canAttack(mob) &&
    isHostile(mob) &&
    isMovable(mob) &&
    hasPath(mob, player) &&
    isAware(mob) &&
    inFov(mob, player)
  );
};

export const move = (mob: Entity): GameAction | undefined => {
  const player = getPlayerEntity();
  if (canMove(mob)) {
    const direction = assert(getDirectionTo(mob, player), "Invalid direction");
    return {
      type: WorldActionType.MOVE,
      entityId: mob.id,
      direction,
    };
  }
};
