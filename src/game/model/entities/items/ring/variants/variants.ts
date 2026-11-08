import { OffensiveRingEntity } from "./OffensiveRing/OffensiveRingEntity"

import { DefensiveRingEntity } from "./DefensiveRing/DefensiveRingEntity"

export const RingEntityVariants = [
  OffensiveRingEntity.type,
  DefensiveRingEntity.type,
] as const

export type RingEntityVariants = (typeof RingEntityVariants)[number]
