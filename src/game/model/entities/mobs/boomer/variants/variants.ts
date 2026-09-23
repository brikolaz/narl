import type { BabyBoomerEntity } from "./BabyBoomer/BabyBoomerEntity"
import type { BoomerEntity } from "./Boomer/BoomerEntity"

export type BoomerEntityVariants =
  typeof BoomerEntity.type | typeof BabyBoomerEntity.type
