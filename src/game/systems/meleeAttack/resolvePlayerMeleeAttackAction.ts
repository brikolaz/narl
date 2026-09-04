import { assert } from "../../../utils/assert";
import { getMob, hasMobs } from "../../model/queries/mobs";
import { getPlayer } from "../../model/queries/player";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getAttackWeapon } from "../attack/getAttackWeapon";
import { rollDmg } from "../hit/dmg";
import type { PlayerMeleeAttackAction } from "../player/types";
import {
  WorldActionType,
  WorldDealDamageActionReason,
} from "../world/types";

export const resolvePlayerMeleeAttackAction = (
  gameAction: PlayerMeleeAttackAction,
): ActionResolution => {
  const action = new Action(gameAction);
  const {targetPosition} = gameAction;   

  (() => {
    const source = getPlayer();
    const target = getTile(targetPosition);

    if (!target || !hasMobs(target)) {
      return action.fail('Nothing to attack')
    }
    const mob = assert(getMob(target), 'No mob to attack')
    const weapon = assert(getAttackWeapon(source), "Can't attack without a weapon")

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
