import type { EntityType } from "../../../../core/model/Entity"
import type { Manual } from "../../Manual"
import {
  BackpackEntity,
  ContainerEntity,
  PlayerBackpackEntity,
} from "./container/ContainerEntity"
import { ContainerEntityManual } from "./container/ContainerEntityManual"
import { HelmetEntity, HornedHelmetEntity } from "./helmet/HelmetEntity"
import { HelmetEntityManual } from "./helmet/HelmetEntityManual"
import { RingEntity } from "./ring/RingEntity"
import { RingEntityManual } from "./ring/RingEntityManual"

export const ITEM_MANUALS = new Map<EntityType, Manual>([
  [HelmetEntity.type, HelmetEntityManual],
  [HornedHelmetEntity.type, HelmetEntityManual],
  [ContainerEntity.type, ContainerEntityManual],
  [BackpackEntity.type, ContainerEntityManual],
  [PlayerBackpackEntity.type, ContainerEntityManual],
  [RingEntity.type, RingEntityManual],
])
