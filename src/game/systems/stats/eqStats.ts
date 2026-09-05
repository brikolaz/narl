import type { Entity } from "../../../core/model/Entity";
import type { Enum, EnumType } from "../../../utils/types/Enum";
import { getAttackDmgRange } from "../attack/dmg";
import { getTotalDef } from "../def/def";
import { formatDmgRange } from "../log/format";

const EqStat = {
  DMG: "DMG",
  DEF: "DEF",
} as const satisfies Enum;
type EqStat = EnumType<typeof EqStat>;

// TODO; remove duplication in Inspect action
export type EqStats = Record<EqStat, number | string>;

// todo: move formatting to renderer
export const getEqStats = (entity: Entity): EqStats => {
  const stats: EqStats = {
    [EqStat.DMG]: 0,
    [EqStat.DEF]: 0,
  };
  stats[EqStat.DMG] = formatDmgRange(getAttackDmgRange(entity));
  stats[EqStat.DEF] = getTotalDef(entity);
  return stats;
};
