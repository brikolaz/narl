import type { EntityType } from "../../../../core/model/Entity"
import type { Manual } from "../../Manual"
import { BackpackEntity } from "./container/variants/Backpack/BackpackEntity"
import { ContainerEntity } from "./container/variants/Container/ContainerEntity"
import { PlayerBackpackEntity } from "./container/variants/PlayerBackpack/PlayerBackpackEntity"
import { BackpackEntityManual } from "./container/variants/Backpack/BackpackEntityManual"
import { ContainerEntityManual } from "./container/variants/Container/ContainerEntityManual"
import { PlayerBackpackEntityManual } from "./container/variants/PlayerBackpack/PlayerBackpackEntityManual"
import { HelmetEntity } from "./helmet/variants/Helmet/HelmetEntity"
import { HornedHelmetEntity } from "./helmet/variants/HornedHelmet/HornedHelmetEntity"
import { HelmetEntityManual } from "./helmet/variants/Helmet/HelmetEntityManual"
import { HornedHelmetEntityManual } from "./helmet/variants/HornedHelmet/HornedHelmetEntityManual"
import { RingEntity } from "./ring/variants/Ring/RingEntity"
import { RingEntityManual } from "./ring/variants/Ring/RingEntityManual"

export const ITEM_MANUALS = new Map<EntityType, Manual>([
  [HelmetEntity.type, HelmetEntityManual],
  [HornedHelmetEntity.type, HornedHelmetEntityManual],
  [ContainerEntity.type, ContainerEntityManual],
  [BackpackEntity.type, BackpackEntityManual],
  [PlayerBackpackEntity.type, PlayerBackpackEntityManual],
  [RingEntity.type, RingEntityManual],
])
