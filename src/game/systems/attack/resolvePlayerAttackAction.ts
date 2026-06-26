import { produce } from "immer";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { ExpComponent } from "../../model/components/mobs/ExpComponent";
import type { ItemEntity } from "../../model/entities/items/ItemEntity";
import { getMobManual } from "../../model/entities/mobs/getMobManual";
import { getBackpack } from "../../model/queries/containers";
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

  const dmg = weapon ? getDmg(weapon) : undefined;
  const mobName = getEntityName(mob);
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
    if (!weapon || !dmg) {
      // TODO: Handle hostile mobs
      return action.success(`Poked ${mobName}`);
    }
    const mobHp = getHp(mob);
    const nextHp = mobHp?.hp - dmg;

    if (nextHp <= 0) {
      const player = getPlayerEntity(draft);
      action.info(`Dealt ${dmg} dmg to ${mobName}`);
      const mobExp = action.assert(ctx.mobExp, "No exp component");
      const playerExp = action.assert(
        getComponentByType(player, ExpComponent),
        "No exp component",
      );
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
        type: WorldActionType.KILL_ENTITY,
        entityType: WorldActionEntityType.MOB,
        entityId: mob.id,
        position: ctx.targetPosition,
      });
      return action.success(`Gained ${mobExp} exp`); // TODO: add GAIN_EXP
    }
    mobHp.hp = nextHp;
    action.success(`Dealt ${dmg} dmg to ${mobName}`);
    getMobManual(mob)?.onAfterTakeDamage?.(mob, draft, action);
  });

  return action.resolve(nextState);
};
