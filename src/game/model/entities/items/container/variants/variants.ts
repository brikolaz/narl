import { BackpackEntity } from "./Backpack/BackpackEntity"
import { ContainerEntity } from "./Container/ContainerEntity"
import { PlayerBackpackEntity } from "./PlayerBackpack/PlayerBackpackEntity"

export const ContainerEntityVariants = [
  ContainerEntity.type,
  BackpackEntity.type,
  PlayerBackpackEntity.type,
] as const

export type ContainerEntityVariants = (typeof ContainerEntityVariants)[number]
