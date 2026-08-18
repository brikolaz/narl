import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { getManual } from "../../model/entities/getManual";
import { rollDmg } from "../dmg/dmg";
import { getHp } from "../../model/queries/hp";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { initDeath } from "../gameOver/death";
import { getEntityName } from "../inspect/getEntityName";
import { type WorldAttackAction } from "../world/types";
import { getAttackWeapon } from "./getAttackWeapon";

export const resolveWorldAttackAction = (
  gameAction: WorldAttackAction,
): ActionResolution => {
  const { sourceId, targetId } = gameAction;
  const action = new Action(gameAction);

  (() => {
    const source = assert(getEntityById(sourceId), "No source");
    const sourceManual = getManual(source);
    const target = assert(getEntityById(targetId), "No target");
    const weapon = getAttackWeapon(source);

    const sourceName = getEntityName(source);
    const targetName = getEntityName(target);

    if (!weapon) {
      return action.success(`${sourceName} poked ${targetName}`); // TODO: add poke resolver?
    }
    const dmg = rollDmg(weapon);
    const targetHp = getHp(target);
    initDeath(() => {
      targetHp.hp = targetHp.hp - dmg;
    });
    sourceManual?.onAttack?.(action, source, target);
    return action.success(
      `${sourceName} hits ${targetName}. ${targetName} lose ${dmg} HP`,
    );
  })();

  return action.resolve();
};
