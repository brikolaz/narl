import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { getManual } from "../../model/entities/getManual";
import { getDmg } from "../../model/queries/dmg";
import { getEquippedWeapon } from "../../model/queries/eq";
import { getHp } from "../../model/queries/hp";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import { type WorldAttackAction } from "../world/types";

export const resolveWorldAttackAction = (
  gameAction: WorldAttackAction,
): ActionResolution => {
  const { sourceId, targetId } = gameAction;
  const action = new Action(gameAction);
  (() => {
    const source = assert(getEntityById(sourceId), "No source");
    const target = assert(getEntityById(targetId), "No target");
    const sourceManual = getManual(source);
    const weapon =
      sourceManual?.getEquippedWeapon?.(source) ?? getEquippedWeapon(source);

    const sourceName = getEntityName(source);
    const targetName = getEntityName(target);

    if (!weapon) {
      return action.success(`${sourceName} poked ${targetName}`);
    }
    const dmg = getDmg(weapon);
    const targetHp = getHp(target);
    targetHp.hp = targetHp.hp - dmg;
    sourceManual?.onAttack?.(action, source, target);
    return action.success(
      `${sourceName} hits ${targetName}. ${targetName} lose ${dmg} HP`,
    );
  })();

  return action.resolve();
};
