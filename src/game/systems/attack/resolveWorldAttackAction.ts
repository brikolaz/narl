import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { getManual } from "../../model/entities/getManual";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getDirection } from "../movement/position";
import { rollAttackDmg } from "./dmg";
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

    if (getManual(source)?.onAttack) {
      getManual(source)?.onAttack?.(action, source, target);
      return
    }
    getManual(source)?.beforeAttack?.(action, source, target);

    const weapon = getAttackWeapon(source);
    if (!weapon) {
      return action.addPendingImmediateAction({
        type: WorldActionType.POKE,
        sourceId: source.id,
        direction: assert(getDirection(source, target), "No poke direction"),
      });
    }
    action.addPendingImmediateAction({
      type: WorldActionType.DEAL_DAMAGE,
      sourceId: source.id,
      targetId: target.id,
      dmg: rollAttackDmg(source),
      reason: WorldDealDamageActionReason.ATTACK,
    });
  })();

  return action.resolve();
};
