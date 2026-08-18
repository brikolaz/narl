import type { Entity } from "../../../core/model/Entity";
import type { Enum, EnumType } from "../../../utils/types/Enum";
import { getEqItems } from "../../model/queries/eq";
import { getTotalDef } from "../hit/def";
import { getDmgRange } from "../hit/dmg";
import type { DmgRange } from "../hit/types";
import { formatDmgRange } from "../log/format";

const EqStat = {
  DMG: "DMG",
  DEF: "DEF",
} as const satisfies Enum;
type EqStat = EnumType<typeof EqStat>;

// TODO: resolve stats based on slots/item types
// TODO; remove duplication in Inspect action
export type EqStats = Record<EqStat, number | string>;

export const getEqStats = (entity: Entity): EqStats => {
  const items = getEqItems(entity);
  const totalDmg: DmgRange = { min: 0, max: 0 };
  const stats: EqStats = {
    [EqStat.DMG]: 0,
    [EqStat.DEF]: 0,
  };
  items.forEach((item) => {
    const itemTotalDmg = getDmgRange(item);
    totalDmg.min += itemTotalDmg.min;
    totalDmg.max += itemTotalDmg.max;
  });
  stats[EqStat.DMG] = formatDmgRange(totalDmg);
  stats[EqStat.DEF] = getTotalDef(entity);
  return stats;
};
