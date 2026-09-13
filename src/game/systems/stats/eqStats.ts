import type { Entity } from "../../../core/model/Entity"
import { createEnum, type EnumType } from "../../../utils/types/Enum"
import { getAttackDmgRange } from "../attack/dmg"
import { getTotalDef } from "../def/def"
import { formatDmgRange } from "../log/format"

const EqStatEnum = createEnum("DMG", "DEF")
type EqStatEnum = EnumType<typeof EqStatEnum>

// TODO; remove duplication in Inspect action
export type EqStats = Record<EqStatEnum, number | string>

// todo: move formatting to renderer
export const getEqStats = (entity: Entity): EqStats => {
  const stats: EqStats = {
    [EqStatEnum.DMG]: 0,
    [EqStatEnum.DEF]: 0,
  }
  stats[EqStatEnum.DMG] = formatDmgRange(getAttackDmgRange(entity))
  stats[EqStatEnum.DEF] = getTotalDef(entity)
  return stats
}
