import type { Entity } from "../../../core/model/Entity"
import { getHp } from "../hp/hp"
import { isPlayer } from "../player/player"
import { getReducedDmg } from "../def/def"
import { initDeath } from "../gameOver/death"

export type Dmg = {
  dmg: number
  nextHp: number
}

export const hit = (target: Entity, sourceDmg: number): Dmg => {
  const dmg = getReducedDmg(target, sourceDmg)
  const targetHp = getHp(target)
  const applyDmg = () => {
    targetHp.hp -= dmg
  }

  if (isPlayer(target)) {
    initDeath(applyDmg)
  } else {
    applyDmg()
  }

  return { dmg, nextHp: targetHp.hp }
}
