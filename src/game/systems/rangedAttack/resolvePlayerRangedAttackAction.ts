import { assert } from "../../../utils/assert";
import { hasMobs } from "../../model/queries/mobs";
import { getPlayer } from "../../model/queries/player";
import { getPosition } from "../../model/queries/position";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getAttackWeapon } from "../attack/getAttackWeapon";
import { getNextPosition } from "../movement/position";
import { PlayerActionType, type PlayerRangedAttackAction } from "../player/types";
import { canPierce, getPierceRange } from "./pierce";

export const resolvePlayerRangedAttackAction = (
  gameAction: PlayerRangedAttackAction,
): ActionResolution => {
  const action = new Action(gameAction);
  const { direction } = gameAction;

  (() => {
    const source = getPlayer();
    const sourcePosition = getPosition(source);

    const weapon = assert(
      getAttackWeapon(source),
      "Can't do ranged attack without a weapon",
    );

    assert(canPierce(weapon), "Weapon can't pierce");

    const pierceRange = getPierceRange(weapon);

    const positionsToPierce: number[] = [];

    let currentPosition = sourcePosition;

    for (let distance = 1; distance <= pierceRange; distance += 1) {
      const nextPosition = getNextPosition({
        currentPosition,
        direction,
      });

      if (nextPosition === null) {
        break;
      }

      positionsToPierce.push(nextPosition);
      currentPosition = nextPosition;
    }

    const targetPositions = positionsToPierce.filter(position =>
      hasMobs(getTile(position)),
    );

    if (targetPositions.length === 0) {
      return action.fail("Nothing to attack");
    }

    for (const targetPosition of targetPositions) {
      action.addPendingImmediateAction({
        type: PlayerActionType.MELEE_ATTACK,
        targetPosition,
      });
    }
  })();

  return action.resolve();
};