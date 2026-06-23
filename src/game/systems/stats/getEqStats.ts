import type { Entity } from "../../../core/ecs/Entity";
import { getDef } from "../attack/def";
import { getChildrenDmg, getDmgMod, getOwnDmg, getDmg } from "../attack/dmg";
import { getEqItems } from "../eq/eq";

enum EqStat {
  TOTAL_DMG = "TOTAL DMG",
  OWN_DMG = "OWN DMG",
  CHILDREN_DMG = "CHILDREN DMG",
  DMG_MOD = "DMG MOD",
  DEF = "DEF",
}
export type EqStats = Record<EqStat, number>;
export const getEqStats = (entity: Entity): EqStats => {
  const items = getEqItems(entity);
  const stats: EqStats = {
    [EqStat.TOTAL_DMG]: 0,
    [EqStat.OWN_DMG]: 0,
    [EqStat.CHILDREN_DMG]: 0,
    [EqStat.DMG_MOD]: 0,
    [EqStat.DEF]: 0,
  };
  items.forEach((item) => {
    stats[EqStat.TOTAL_DMG] += getDmg(item);
    stats[EqStat.OWN_DMG] = getOwnDmg(item);
    stats[EqStat.CHILDREN_DMG] = getChildrenDmg(item);
    stats[EqStat.DMG_MOD] = getDmgMod(item);
    stats[EqStat.DEF] = getDef(item);
  });
  return stats;
};
