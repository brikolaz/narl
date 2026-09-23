import type { BackpackEntity } from "./Backpack/BackpackEntity"
import type { ContainerEntity } from "./Container/ContainerEntity"
import type { PlayerBackpackEntity } from "./PlayerBackpack/PlayerBackpackEntity"

export type ContainerEntityVariants =
  | typeof ContainerEntity.type
  | typeof BackpackEntity.type
  | typeof PlayerBackpackEntity.type
