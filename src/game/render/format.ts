import type { DmgRange } from "../systems/attack/dmg"

export const formatDmgRange = ({ min, max }: DmgRange): number | string =>
  min === max ? min : `${min}-${max}`
