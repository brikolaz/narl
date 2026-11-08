import { HelmetEntity } from "./Helmet/HelmetEntity"
import { HornedHelmetEntity } from "./HornedHelmet/HornedHelmetEntity"

export const HelmetEntityVariants = [
  HelmetEntity.type,
  HornedHelmetEntity.type,
] as const

export type HelmetEntityVariants = (typeof HelmetEntityVariants)[number]
