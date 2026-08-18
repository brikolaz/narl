import type { Entity } from "../../../core/model/Entity";
import { assert } from "../../../utils/assert";
import { getHp } from "../../model/queries/hp";
import { isPlayer } from "../../model/queries/player";
import { getAttackWeapon } from "../attack/getAttackWeapon";
import { initDeath } from "../gameOver/death";
import { getReducedDmg } from "./def";
import { rollDmg } from "./dmg";

type Hit = {
  dmg: number;
  nextHp: number;
};

export const hit = (source: Entity, target: Entity): Hit => {
  const weapon = getAttackWeapon(source);
  const dmg = assert(weapon ? rollDmg(weapon) : undefined, "Weapon has no dmg");
  const reducedDmg = getReducedDmg(target, dmg);

  const targetHp = getHp(target);
  if (isPlayer(target)) {
    initDeath(() => {
      targetHp.hp = targetHp.hp - reducedDmg;
    });
  } else {
    targetHp.hp = targetHp.hp - reducedDmg;
  }

  return { dmg: reducedDmg, nextHp: targetHp.hp };
};
