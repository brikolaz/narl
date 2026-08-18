import { getManual } from "../../model/entities/getManual";
import { getMob, hasMobs } from "../../model/queries/mobs";
import { getPlayer } from "../../model/queries/player";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { hit } from "../dmg/hit";
import { getEntityName } from "../inspect/getEntityName";
import { PlayerActionType, type PlayerPokeAction } from "../player/types";
import { WorldActionType } from "../world/types";
import { getAttackWeapon } from "./getAttackWeapon";

export const resolvePlayerAttackAction = (
  gameAction: PlayerPokeAction,
): ActionResolution => {
  const { targetPosition } = gameAction;
  const action = new Action(gameAction);
  (() => {
    const target = getTile(targetPosition);
    if (!hasMobs(target)) {
      return;
    }
    const mob = getMob(target);
    if (!mob) {
      return;
    }
    const weapon = getAttackWeapon(getPlayer());

    if (!weapon) {
      return action.addPendingImmediateAction({
        type: PlayerActionType.POKE,
        targetPosition,
      });
    }
    const { dmg, nextHp } = hit(getPlayer(), mob);

    action.success(`Dealt ${dmg} dmg to ${getEntityName(mob)}`);

    if (nextHp <= 0) {
      action.addPendingImmediateAction({
        type: WorldActionType.KILL,
        entityId: mob.id,
        position: targetPosition,
      });
    } else {
      getManual(mob)?.onAfterTakeDamage?.(action, mob);
    }
  })();

  return action.resolve();
};
