import { createEnum, type EnumType } from "../../../utils/types/Enum"
import { MAX_WORLD_SIZE } from "../../../utils/constants"

export const ZoneEnum = createEnum(
  "START",
  "EARLY",
  "LOW",
  "MID",
  "HIGH",
  "LATE",
  "FINAL",
)
export type ZoneEnum = EnumType<typeof ZoneEnum>

export const getZone = (position: number): ZoneEnum => {
  if (position === 0) return ZoneEnum.START
  if (position < 50) return ZoneEnum.EARLY
  if (position < 300) return ZoneEnum.LOW
  if (position < 900) return ZoneEnum.MID
  if (position < 1500) return ZoneEnum.HIGH
  if (position < MAX_WORLD_SIZE - 1) return ZoneEnum.LATE

  return ZoneEnum.FINAL
}
