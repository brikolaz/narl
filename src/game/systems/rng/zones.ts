import { createEnum, type EnumType } from "../../../utils/types/Enum"
import { MAX_WORLD_SIZE } from "../../../utils/constants"

export const ZoneEnum = createEnum(
  "EARLY",
  "LOW",
  "MID",
  "HIGH",
  "LATE",
  "FINAL",
)
export type ZoneEnum = EnumType<typeof ZoneEnum>

export const getZone = (position: number): ZoneEnum => {
  if (position < 50) return ZoneEnum.EARLY
  if (position < 100) return ZoneEnum.LOW
  if (position < 150) return ZoneEnum.MID
  if (position < 200) return ZoneEnum.HIGH
  if (position < MAX_WORLD_SIZE - 1) return ZoneEnum.LATE

  return ZoneEnum.FINAL
}
