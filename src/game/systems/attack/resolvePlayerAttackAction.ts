import { produce } from "immer";
import { getManual } from "../../model/entities/getManual";
import { getDmg } from "../../model/queries/dmg";
import { getEquippedWeapon } from "../../model/queries/eq";
import { getHp } from "../../model/queries/hp";
import { getMob, hasMobs } from "../../model/queries/mobs";
import { getPlayerEntity } from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import type { PlayerAttackAction } from "../player/types";
import { WorldActionType } from "../world/types";
import type { Entity } from "../../../core/ecs/Entity";

type AttackContext =
  | {
      ok: true;
      targetPosition: number;
      weapon: Entity;
      dmg: number;
      mobName: string;
    }
  | {
      ok: true;
      targetPosition: number;
      mobName: string;
    }
  | {
      ok: false;
      message: string;
    };

// TODO: can be deleted
export const prepareAttack = (
  state: GameState,
  { targetPosition }: PlayerAttackAction,
): AttackContext => {
  const target = state.world[targetPosition];

  if (!target || !hasMobs(target)) {
    return { ok: false, message: "No mobs to attack in that direction." };
  }

  const mob = getMob(target);
  if (!mob) {
    return { ok: false, message: "No mobs to attack in that direction." };
  }

  const player = getPlayerEntity(state);

  const weapon = getEquippedWeapon(player);

  const dmg = weapon ? getDmg(weapon) : undefined;
  const mobName = getEntityName(mob);

  return {
    ok: true,
    targetPosition,
    weapon,
    dmg,
    mobName,
  };
};

export const resolvePlayerAttackAction = (
  state: GameState,
  gameAction: PlayerAttackAction,
): ActionResolution => {
  const action = new Action(gameAction);
  const ctx = prepareAttack(state, gameAction);
  const nextState = produce(state, (draft) => {
    if (!ctx.ok) {
      return;
    }
    const target = draft.world[ctx.targetPosition];
    if (!hasMobs(target)) {
      return action.fail("No mobs to attack in that direction.");
    }
    const mob = getMob(target);
    const mobName = ctx.mobName;
    if (!mob) {
      return action.fail("No mobs to attack in that direction.");
    }
    const weapon = "weapon" in ctx ? ctx.weapon : undefined;
    const dmg = "dmg" in ctx ? ctx.dmg : undefined;
    // TODO: add Poke resolver, add keybinding
    if (!weapon || !dmg) {
      if (getManual(mob)?.poke) {
        getManual(mob)?.poke?.(mob, action);
        return;
      }
      return action.success(`Poked ${mobName}`);
    }
    const mobHp = getHp(mob);
    const nextHp = mobHp?.hp - dmg;

    if (nextHp <= 0) {
      action.info(`Dealt ${dmg} dmg to ${mobName}`);

      action.addPending({
        type: WorldActionType.KILL,
        entityId: mob.id,
        position: ctx.targetPosition,
      });
    }
    mobHp.hp = nextHp;
    action.success(`Dealt ${dmg} dmg to ${mobName}`);
    getManual(mob)?.onAfterTakeDamage?.(mob, draft, action);
  });

  return action.resolve(nextState);
};
