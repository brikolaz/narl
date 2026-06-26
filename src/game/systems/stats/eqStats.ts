import type { Entity } from "../../../core/ecs/Entity";
import { getDef } from "../../model/queries/def";
import {
  getChildrenDmg,
  getDmg,
  getDmgMod,
  getOwnDmg,
} from "../../model/queries/dmg";
import { getEqItems } from "../../model/queries/eq";

enum EqStat {
  TOTAL_DMG = "TOTAL DMG",
  OWN_DMG = "OWN DMG",
  CHILDREN_DMG = "CHILDREN DMG",
  DMG_MOD = "DMG MOD",
  DEF = "DEF",
}

// TODO: resolve stats based on slots/item types
// TODO; remove duplication in Inspect action
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
    stats[EqStat.OWN_DMG] += getOwnDmg(item);
    stats[EqStat.CHILDREN_DMG] += getChildrenDmg(item);
    stats[EqStat.DMG_MOD] ||= getDmgMod(item);
    stats[EqStat.DEF] += getDef(item);
  });
  return stats;
};
