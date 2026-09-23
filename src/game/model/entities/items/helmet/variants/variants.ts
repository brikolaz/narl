import type { HelmetEntity } from "./Helmet/HelmetEntity"
import type { HornedHelmetEntity } from "./HornedHelmet/HornedHelmetEntity"

export type HelmetEntityVariants =
  typeof HelmetEntity.type | typeof HornedHelmetEntity.type
