import { LongSwordEntity } from "./LongSword/LongSwordEntity"
import { SwordEntity } from "./Sword/SwordEntity"

export const SwordEntityVariants = [
  SwordEntity.type,
  LongSwordEntity.type,
] as const

export type SwordEntityVariants = (typeof SwordEntityVariants)[number]
