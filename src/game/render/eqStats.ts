import type { Entity } from "../../core/model/Entity"
import { createEnum, type EnumType } from "../../core/utils/types/Enum"
import { getAttackDmgRange } from "../systems/attack/dmg"
import { getTotalDef } from "../systems/def/def"
import { formatDmgRange } from "./format"

const EqStatEnum = createEnum("DMG", "DEF")
type EqStatEnum = EnumType<typeof EqStatEnum>

// TODO; remove duplication in Inspect action
export type EqStats = Record<EqStatEnum, number | string>

export const getEqStats = (entity: Entity): EqStats => {
  const stats: EqStats = {
    [EqStatEnum.DMG]: 0,
    [EqStatEnum.DEF]: 0,
  }
  stats[EqStatEnum.DMG] = formatDmgRange(getAttackDmgRange(entity))
  stats[EqStatEnum.DEF] = getTotalDef(entity)
  return stats
}
