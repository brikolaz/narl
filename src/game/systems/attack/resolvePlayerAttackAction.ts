import { getMob, hasMobs } from "../../model/queries/mobs";
import { getPlayer } from "../../model/queries/player";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { rollDmg } from "../hit/dmg";
import { PlayerActionType, type PlayerAttackAction } from "../player/types";
import {
  WorldActionType,
  WorldDealDamageActionReason,
} from "../world/types";
import { getAttackWeapon } from "./getAttackWeapon";

export const resolvePlayerAttackAction = (
  gameAction: PlayerAttackAction,
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
    const weapon = getAttackWeapon(source);

    if (!weapon) {
      return action.addPendingImmediateAction({
        type: PlayerActionType.POKE,
        targetPosition,
      });
    }
    action.addPendingImmediateAction({
      type: WorldActionType.DEAL_DAMAGE,
      sourceId: source.id,
      targetId: mob.id,
      dmg: rollDmg(weapon),
      reason: WorldDealDamageActionReason.ATTACK,
    });
  })();

  return action.resolve();
};
