import { produce } from "immer";
import { getPlayer } from "../../state";
import type { GameState } from "../../state/state";
import {
  WorldActionEntityType,
  WorldActionType,
  type ActionResolution,
} from "../turn";

import { getComponentByType } from "../../../core/ecs";
import { ExpComponent, ItemEntity } from "../../model";
import { NameComponent } from "../../model/components/AppearanceComponent copy";
import { getEquippedWeapon, getEquippedWeaponDamage } from "../eq";
import { getBackpack } from "../inv";
import { Action } from "../log";
import { getHp } from "./hp";
import { getMob, hasMobs } from "./mobs";

type AttackContext =
  | {
      ok: true;
      targetPosition: number;
      weapon: ItemEntity;
      dmg: number;
      mobExp: number;
      mobName: string;
    }
  | {
      ok: false;
      message: string;
    };

export const prepareAttack = (
  state: GameState,
  targetPosition: number,
): AttackContext => {
  const target = state.world[targetPosition];

  if (!target || !hasMobs(target)) {
    return { ok: false, message: "No mobs to attack in that direction." };
  }

  const mob = getMob(target);
  if (!mob) {
    return { ok: false, message: "No mobs to attack in that direction." };
  }

  const player = getPlayer(state);

  const weapon = getEquippedWeapon(player);
  if (!weapon) {
    return { ok: false, message: "No weapon equipped." };
  }

  const dmg = getEquippedWeaponDamage(weapon);
  const mobName = getComponentByType(mob, NameComponent)?.name ?? "mob";
  const mobExp = getComponentByType(mob, ExpComponent)?.exp ?? 0;

  return {
    ok: true,
    targetPosition,
    weapon,
    dmg,
    mobExp,
    mobName,
  };
};

export const resolveAttackAction = (
  state: GameState,
  ctx: AttackContext,
): ActionResolution => {
  const action = new Action();
  const nextState = produce(state, (draft) => {
    if (!ctx.ok) {
      return;
    }
    const target = draft.world[ctx.targetPosition];
    if (!hasMobs(target)) {
      return action.reject("No mobs to attack in that direction.");
    }
    const mob = getMob(target);
    if (!mob) {
      return action.reject("No mobs to attack in that direction.");
    }
    const weapon = ctx.weapon;
    if (!weapon) {
      action.reject("No weapon.");
    }
    const dmg = ctx.dmg;
    const mobHp = getHp(mob);
    const nextHp = mobHp?.hp - dmg;
    const mobName = ctx.mobName;

    if (nextHp <= 0) {
      const player = getPlayer(draft);
      action.log(`Dealt ${dmg} dmg to ${mobName}`);
      const mobExp = ctx.mobExp;
      const playerExp = getComponentByType(player, ExpComponent);
      if (!mobExp || !playerExp) {
        throw new Error("No exp component");
      }
      playerExp.exp += mobExp;
      const mobContainer = getBackpack(mob);
      // TODO: move death consequences to EntityDiedAction resolver
      if (mobContainer) {
        action.addPending({
          type: WorldActionType.DROP_ITEM,
          entityType: WorldActionEntityType.MOB,
          entityId: mob.id,
          targetPosition: ctx.targetPosition,
          itemId: mobContainer.id,
        });
      }
      action.addPending({
        type: WorldActionType.REMOVE_ENTITY,
        entityType: WorldActionEntityType.MOB,
        entityId: mob.id,
        position: ctx.targetPosition,
      });
      return action.fulfill(`Gained ${mobExp} exp`);
    }
    mobHp.hp = nextHp;
    action.fulfill(`Dealt ${dmg} dmg to ${mobName}`);
  });

  return action.resolve(nextState);
};
