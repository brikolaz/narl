import { produce } from "immer";
import { getMobManual } from "../../model/entities/mobs/getMobManual";
import { getDmg } from "../../model/queries/dmg";
import {
  getEquippedWeapon
} from "../../model/queries/eq";
import { getHp } from "../../model/queries/hp";
import { getMobById } from "../../model/queries/mobs";
import { getPlayerEntity } from "../../model/queries/player";
import { getTile } from "../../model/queries/tile";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import { type WorldAttackAction } from "../world/types";

export const resolveWorldAttackAction = (
  state: GameState,
  gameAction: WorldAttackAction,
): ActionResolution => {
  const { sourcePos, mobId } = gameAction;
  const action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
  
    const sourceTile = getTile(draft, sourcePos);
    const mob = action.assert(getMobById(sourceTile, mobId), "No mob");
    const player = getPlayerEntity(draft);
    const mobWeapon =
      getMobManual(mob)?.getEquippedWeapon?.(mob) ?? getEquippedWeapon(mob);
    const mobName = getEntityName(mob);

    if (!mobWeapon) {
      return action.success(`${mobName} poked you`); // TODO: dynamic target
    }
    const mobDmg = getDmg(mobWeapon);
    const playerHp = getHp(player);
    playerHp.hp = playerHp.hp - mobDmg;
    return action.success(`${mobName} hits you. You lose ${mobDmg} HP`);
  });

  return action.resolve(nextState);
};
