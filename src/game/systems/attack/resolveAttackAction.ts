import { produce } from "immer";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { ExpComponent } from "../../model/components/ExpComponent";
import { NameComponent } from "../../model/components/NameComponent";
import type { ItemEntity } from "../../model/entities/items/ItemEntity";
import { getPlayerEntity } from "../../state/selectors/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEquippedWeapon, getEquippedWeaponDamage } from "../eq/eq";
import type { PlayerAttackAction } from "../player/types";
import { getMob, hasMobs } from "./mobs";
import { getHp } from "./hp";
import { getBackpack } from "../inv/containers";
import { WorldActionEntityType, WorldActionType } from "../world/types";

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
      ok: true;
      targetPosition: number;
      mobExp: number;
      mobName: string;
    }
  | {
      ok: false;
      message: string;
    };

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

  const dmg = weapon ? getEquippedWeaponDamage(weapon) : undefined;
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
    if (!weapon || !dmg) {
      // TODO: Handle hostile mobs
      return action.success(`Poked ${mobName}`);
    }
    const mobHp = getHp(mob);
    const nextHp = mobHp?.hp - dmg;

    if (nextHp <= 0) {
      const player = getPlayerEntity(draft);
      action.info(`Dealt ${dmg} dmg to ${mobName}`);
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
      return action.success(`Gained ${mobExp} exp`);
    }
    mobHp.hp = nextHp;
    action.success(`Dealt ${dmg} dmg to ${mobName}`);
  });

  return action.resolve(nextState);
};
