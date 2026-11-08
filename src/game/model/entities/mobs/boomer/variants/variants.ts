import { BabyBoomerEntity } from "./BabyBoomer/BabyBoomerEntity"
import { BoomerEntity } from "./Boomer/BoomerEntity"

export const BoomerEntityVariants = [
  BoomerEntity.type,
  BabyBoomerEntity.type,
] as const

export type BoomerEntityVariants = (typeof BoomerEntityVariants)[number]
