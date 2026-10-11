import type { ItemFactory } from "../../Factory"
import { ArmorEntityFactory } from "./armor/factory"
import type { ArmorEntityVariants } from "./armor/variants/variants"
import { ArmorEntity } from "./armor/variants/Armor/ArmorEntity"
import { BootsEntityFactory } from "./boots/factory"
import type { BootsEntityVariants } from "./boots/variants/variants"
import { BootsEntity } from "./boots/variants/Boots/BootsEntity"
import { ContainerEntityFactory } from "./container/factory"
import type { ContainerEntityVariants } from "./container/variants/variants"
import { BackpackEntity } from "./container/variants/Backpack/BackpackEntity"
import { ContainerEntity } from "./container/variants/Container/ContainerEntity"
import { PlayerBackpackEntity } from "./container/variants/PlayerBackpack/PlayerBackpackEntity"
import { DickEntityFactory } from "./dick/factory"
import type { DickEntityVariants } from "./dick/variants/variants"
import { DickEntity } from "./dick/variants/Dick/DickEntity"
import { HelmetEntityFactory } from "./helmet/factory"
import type { HelmetEntityVariants } from "./helmet/variants/variants"
import { HelmetEntity } from "./helmet/variants/Helmet/HelmetEntity"
import { HornedHelmetEntity } from "./helmet/variants/HornedHelmet/HornedHelmetEntity"
import { PantsEntityFactory } from "./pants/factory"
import type { PantsEntityVariants } from "./pants/variants/variants"
import { PantsEntity } from "./pants/variants/Pants/PantsEntity"
import { RingEntityFactory } from "./ring/factory"
import type { RingEntityVariants } from "./ring/variants/variants"
import { RingEntity } from "./ring/variants/Ring/RingEntity"
import { ShieldEntityFactory } from "./shield/factory"
import type { ShieldEntityVariants } from "./shield/variants/variants"
import { ShieldEntity } from "./shield/variants/Shield/ShieldEntity"
import { SwordEntityFactory } from "./sword/factory"
import type { SwordEntityVariants } from "./sword/variants/variants"
import { LongSwordEntity } from "./sword/variants/LongSword/LongSwordEntity"
import { SwordEntity } from "./sword/variants/Sword/SwordEntity"

import { AxeEntity } from "./axe/variants/Axe/AxeEntity"
import { AxeEntityFactory } from "./axe/factory"

import type { AxeEntityVariants } from "./axe/variants/variants"

export type ItemEntityVariants =
  | ArmorEntityVariants
  | BootsEntityVariants
  | ContainerEntityVariants
  | DickEntityVariants
  | HelmetEntityVariants
  | PantsEntityVariants
  | RingEntityVariants
  | ShieldEntityVariants
  | SwordEntityVariants
  | AxeEntityVariants

export const ITEM_FACTORIES = new Map<ItemEntityVariants, ItemFactory>([
  [ArmorEntity.type, ArmorEntityFactory],
  [BootsEntity.type, BootsEntityFactory],
  [BackpackEntity.type, ContainerEntityFactory],
  [ContainerEntity.type, ContainerEntityFactory],
  [PlayerBackpackEntity.type, ContainerEntityFactory],
  [DickEntity.type, DickEntityFactory],
  [HelmetEntity.type, HelmetEntityFactory],
  [HornedHelmetEntity.type, HelmetEntityFactory],
  [PantsEntity.type, PantsEntityFactory],
  [RingEntity.type, RingEntityFactory],
  [ShieldEntity.type, ShieldEntityFactory],
  [LongSwordEntity.type, SwordEntityFactory],
  [SwordEntity.type, SwordEntityFactory],
  [AxeEntity.type, AxeEntityFactory],
])
