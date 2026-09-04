import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { getManual } from "../../model/entities/getManual";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { rollDmg } from "../hit/dmg";
import { getEntityName } from "../inspect/getEntityName";
import {
  WorldActionType,
  WorldDealDamageActionReason,
  type WorldAttackAction,
} from "../world/types";
import { getAttackWeapon } from "./getAttackWeapon";

// TODO: onAttack should override the whole attack flow
export const resolveWorldAttackAction = (
  gameAction: WorldAttackAction,
): ActionResolution => {
  const { sourceId, targetId } = gameAction;
  const action = new Action(gameAction);

  (() => {
    const source = assert(getEntityById(sourceId), "No source");
    const target = assert(getEntityById(targetId), "No target");

    const sourceName = getEntityName(source);
    const targetName = getEntityName(target);

    if (getManual(source)?.onAttack) {
      getManual(source)?.onAttack?.(action, source, target);
      return
    }
    getManual(source)?.beforeAttack?.(action, source, target);

    const weapon = getAttackWeapon(source);
    if (!weapon) {
      return action.success(`${sourceName} poked ${targetName}`); // TODO: add poke resolver?
    }
    action.addPendingImmediateAction({
      type: WorldActionType.DEAL_DAMAGE,
      sourceId: source.id,
      targetId: target.id,
      dmg: rollDmg(weapon),
      reason: WorldDealDamageActionReason.ATTACK,
    });
  })();

  return action.resolve();
};
