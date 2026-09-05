import type { Entity } from "../../../core/model/Entity";
import { getHp } from "../../model/queries/hp";
import { isPlayer } from "../../model/queries/player";
import { getReducedDmg } from "../def/def";
import { initDeath } from "../gameOver/death";

export type Damage = {
  dmg: number;
  nextHp: number;
};

export const hit = (target: Entity, sourceDmg: number): Damage => {
  const dmg = getReducedDmg(target, sourceDmg);
  const targetHp = getHp(target);
  const applyDamage = () => {
    targetHp.hp -= dmg;
  };

  if (isPlayer(target)) {
    initDeath(applyDamage);
  } else {
    applyDamage();
  }

  return { dmg, nextHp: targetHp.hp };
};
