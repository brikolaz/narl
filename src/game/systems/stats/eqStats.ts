import type { Entity } from "../../../core/model/Entity";
import type { Enum, EnumType } from "../../../utils/types/Enum";
import { getDef } from "../../model/queries/def";
import {
  type DmgRange,
  formatDmgRange,
  getChildrenDmgRange,
  getDmgRange,
  getDmgMod,
  getOwnDmgRange,
} from "../dmg/dmg";
import { getEqItems } from "../../model/queries/eq";

const EqStat = {
  TOTAL_DMG: "TOTAL DMG",
  OWN_DMG: "OWN DMG",
  CHILDREN_DMG: "CHILDREN DMG",
  DMG_MOD: "DMG MOD",
  DEF: "DEF",
} as const satisfies Enum;
type EqStat = EnumType<typeof EqStat>;

// TODO: resolve stats based on slots/item types
// TODO; remove duplication in Inspect action
export type EqStats = Record<EqStat, number | string>;

// TODO: refactor
export const getEqStats = (entity: Entity): EqStats => {
  const items = getEqItems(entity);
  const totalDmg: DmgRange = { min: 0, max: 0 };
  const ownDmg: DmgRange = { min: 0, max: 0 };
  const childrenDmg: DmgRange = { min: 0, max: 0 };
  const stats: EqStats = {
    [EqStat.TOTAL_DMG]: 0,
    [EqStat.OWN_DMG]: 0,
    [EqStat.CHILDREN_DMG]: 0,
    [EqStat.DMG_MOD]: 0,
    [EqStat.DEF]: 0,
  };
  items.forEach((item) => {
    const itemTotalDmg = getDmgRange(item);
    totalDmg.min += itemTotalDmg.min;
    totalDmg.max += itemTotalDmg.max;
    const itemOwnDmg = getOwnDmgRange(item);
    ownDmg.min += itemOwnDmg.min;
    ownDmg.max += itemOwnDmg.max;
    const itemChildrenDmg = getChildrenDmgRange(item);
    childrenDmg.min += itemChildrenDmg.min;
    childrenDmg.max += itemChildrenDmg.max;
    stats[EqStat.DMG_MOD] ||= getDmgMod(item);
    stats[EqStat.DEF] = Number(stats[EqStat.DEF]) + getDef(item);
  });
  stats[EqStat.TOTAL_DMG] = formatDmgRange(totalDmg);
  stats[EqStat.OWN_DMG] = formatDmgRange(ownDmg);
  stats[EqStat.CHILDREN_DMG] = formatDmgRange(childrenDmg);
  return stats;
};
