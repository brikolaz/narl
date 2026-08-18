import type { Entity } from "../../../core/model/Entity";
import { assert } from "../../../utils/assert";
import { getHp } from "../../model/queries/hp";
import { isPlayer } from "../../model/queries/player";
import { getAttackWeapon } from "../attack/getAttackWeapon";
import { initDeath } from "../gameOver/death";
import { rollDmg } from "./dmg";

type Hit = {
  dmg: number;
  nextHp: number;
};

export const hit = (source: Entity, target: Entity): Hit => {
  const weapon = getAttackWeapon(source);
  const dmg = assert(weapon ? rollDmg(weapon) : undefined, "Weapon has no dmg");

  const targetHp = getHp(target);
  if (isPlayer(target)) {
    initDeath(() => {
      targetHp.hp = targetHp.hp - dmg;
    });
  } else {
    targetHp.hp = targetHp.hp - dmg;
  }

  return { dmg, nextHp: targetHp.hp };
};
