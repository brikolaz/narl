import type { Entity } from "../../../core/model/Entity";
import { assert } from "../../../utils/assert";
import { getAttackWeapon } from "../attack/getAttackWeapon";
import { damage, type Damage } from "./damage";
import { rollDmg } from "./dmg";

export const hit = (source: Entity, target: Entity): Damage => {
  const weapon = getAttackWeapon(source);
  const sourceDmg = assert(
    weapon ? rollDmg(weapon) : undefined,
    "Weapon has no dmg",
  );

  return damage(target, sourceDmg);
};
