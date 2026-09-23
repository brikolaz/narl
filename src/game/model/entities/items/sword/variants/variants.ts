import type { LongSwordEntity } from "./LongSword/LongSwordEntity"
import type { SwordEntity } from "./Sword/SwordEntity"

export type SwordEntityVariants =
  typeof SwordEntity.type | typeof LongSwordEntity.type
