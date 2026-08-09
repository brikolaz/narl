import { getManual } from "../../model/entities/getManual";
import { getDmg } from "../../model/queries/dmg";
import { getHp } from "../../model/queries/hp";
import { getMob, hasMobs } from "../../model/queries/mobs";
import { getPlayer } from "../../model/queries/player";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
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
    const dmg = weapon ? getDmg(weapon) : undefined;

    if (!weapon || !dmg) {
      return action.addPendingImmediateAction({
        type: PlayerActionType.POKE,
        targetPosition,
      });
    }
    const mobHp = getHp(mob);
    const nextHp = mobHp?.hp - dmg;

    if (nextHp <= 0) {
      action.addPendingImmediateAction({
        type: WorldActionType.KILL,
        entityId: mob.id,
        position: targetPosition,
      });
    } else {
      getManual(mob)?.onAfterTakeDamage?.(action, mob);
    }
    mobHp.hp = nextHp;
    action.success(`Dealt ${dmg} dmg to ${getEntityName(mob)}`);
  })();

  return action.resolve();
};
