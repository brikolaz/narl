import type { EntityType } from "../../../../core/model/Entity"
import type { Manual } from "../../Manual"
import { BackpackEntity } from "./container/variants/Backpack/BackpackEntity"
import { ContainerEntity } from "./container/variants/Container/ContainerEntity"
import { PlayerBackpackEntity } from "./container/variants/PlayerBackpack/PlayerBackpackEntity"
import { BackpackEntityManual } from "./container/variants/Backpack/BackpackEntityManual"
import { ContainerEntityManual } from "./container/variants/Container/ContainerEntityManual"
import { PlayerBackpackEntityManual } from "./container/variants/PlayerBackpack/PlayerBackpackEntityManual"
import { HornedHelmetEntity } from "./helmet/variants/HornedHelmet/HornedHelmetEntity"
import { HornedHelmetEntityManual } from "./helmet/variants/HornedHelmet/HornedHelmetEntityManual"
import { RingEntity } from "./ring/variants/Ring/RingEntity"
import { RingEntityManual } from "./ring/variants/Ring/RingEntityManual"

export const ITEM_MANUALS = new Map<EntityType, Manual>([
  [HornedHelmetEntity.type, HornedHelmetEntityManual],
  [ContainerEntity.type, ContainerEntityManual],
  [BackpackEntity.type, BackpackEntityManual],
  [PlayerBackpackEntity.type, PlayerBackpackEntityManual],
  [RingEntity.type, RingEntityManual],
])
