import { getPlayer } from "../../model/queries/player";
import { getPosition } from "../../model/queries/position";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getNextPosition } from "../movement/position";
import { PlayerActionType, type PlayerAttackAction } from "../player/types";
import { canPierce } from "../rangedAttack/pierce";
import { getAttackWeapon } from "./getAttackWeapon";

export const resolvePlayerAttackAction = (
  gameAction: PlayerAttackAction,
): ActionResolution => {
  const action = new Action(gameAction);
  const { direction } = gameAction;
  (() => {
    const source = getPlayer();
    const targetPosition = getNextPosition({
      currentPosition: getPosition(source),
      direction
    })

    const weapon = getAttackWeapon(source);

    if (!weapon) {
      return action.addPendingImmediateAction({
        type: PlayerActionType.POKE,
        direction
      });
    }

    if (canPierce(weapon)) {
      return action.addPendingImmediateAction({
        type: PlayerActionType.RANGED_ATTACK,
        direction,
      });
    }

    if (targetPosition === null) {
      return action.fail("Nothing to attack")
    }
    action.addPendingImmediateAction({
      type: PlayerActionType.MELEE_ATTACK,
      targetPosition
    });
  })();

  return action.resolve();
};
