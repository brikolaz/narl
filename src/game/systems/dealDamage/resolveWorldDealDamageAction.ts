import { getEntityById } from "../../../core/model/queries/entities/get";
import { getManual } from "../../model/entities/getManual";
import { isPlayer } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { resolveMobDeath } from "../attack/resolveMobDeath";
import { hit } from "../hit/hit";
import { getEntityName } from "../inspect/getEntityName";
import {
  WorldDealDamageActionReason,
  WorldKillActionReason,
  type WorldDealDamageAction,
} from "../world/types";

export const resolveWorldDealDamageAction = (
  gameAction: WorldDealDamageAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    const source = getEntityById(gameAction.sourceId);
    const target = getEntityById(gameAction.targetId);
    if (
      !target ||
      (gameAction.reason === WorldDealDamageActionReason.ATTACK && !source)
    ) {
      return;
    }
    const hitResult = hit(target, gameAction.dmg);

    if (gameAction.reason === WorldDealDamageActionReason.ATTACK) {
      if (hitResult.dmg === 0) {
        action.success(
          `${getEntityName(source)} tingled ${getEntityName(target)}`,
        );
      } else {
        action.success(
          `${getEntityName(source)} hits ${getEntityName(target)} for ${hitResult.dmg} HP`,
        );
      }
    } else if (hitResult.dmg === 0) {
      action.success(`Explosion tingled ${getEntityName(target)}`);
    } else {
      action.info(
        `${getEntityName(target)} takes ${hitResult.dmg} explosion DMG`,
      );
    }

    if (hitResult.nextHp <= 0 && !isPlayer(target)) {
      resolveMobDeath(
        action,
        target,
        gameAction.reason === WorldDealDamageActionReason.EXPLODE
          ? WorldKillActionReason.EXPLODE
          : WorldKillActionReason.ATTACK,
      );
    } else if (hitResult.nextHp > 0) {
      getManual(target)?.onAfterTakeDamage?.(action, target);
    }
  })();

  return action.resolve();
};
