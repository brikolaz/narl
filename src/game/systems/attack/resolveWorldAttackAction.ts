import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { getManual } from "../../model/entities/getManual";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { hit } from "../hit/hit";
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
    const target = assert(getEntityById(targetId), "No target");

    const sourceName = getEntityName(source);
    const targetName = getEntityName(target);

    const weapon = getAttackWeapon(source);
    if (!weapon) {
      return action.success(`${sourceName} poked ${targetName}`); // TODO: add poke resolver?
    }
    const { dmg } = hit(source, target);
    getManual(source)?.onAttack?.(action, source, target);
    if (dmg === 0) {
      return action.success(
        `${sourceName} tingled ${targetName}`,
      );
    }
    return action.success(
      `${sourceName} hits ${targetName} for ${dmg} HP`,
    );
  })();

  return action.resolve();
};
