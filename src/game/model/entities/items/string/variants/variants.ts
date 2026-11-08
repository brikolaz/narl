import { OffensiveStringEntity } from "./OffensiveString/OffensiveStringEntity"

import { DefensiveStringEntity } from "./DefensiveString/DefensiveStringEntity"

export const StringEntityVariants = [
  OffensiveStringEntity.type,
  DefensiveStringEntity.type,
] as const

export type StringEntityVariants = (typeof StringEntityVariants)[number]
