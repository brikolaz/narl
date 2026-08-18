import { getManual } from "../../model/entities/getManual";
import { getMob, hasMobs } from "../../model/queries/mobs";
import { getPlayer } from "../../model/queries/player";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { hit } from "../hit/hit";
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
    const source = getPlayer();

    if (!hasMobs(target)) {
      return;
    }
    const mob = getMob(target);
    if (!mob) {
      return;
    }
    const sourceName = getEntityName(source);
    const targetName = getEntityName(mob);
    const weapon = getAttackWeapon(getPlayer());

    if (!weapon) {
      return action.addPendingImmediateAction({
        type: PlayerActionType.POKE,
        targetPosition,
      });
    }
    const { dmg, nextHp } = hit(getPlayer(), mob);

    if (dmg === 0) {
      action.success(`${sourceName} tingled ${targetName}`);
    } else {
      action.success(`${sourceName} hit ${targetName} for ${dmg} HP`);
    }

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
