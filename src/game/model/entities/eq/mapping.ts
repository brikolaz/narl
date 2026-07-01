import type { EntityClass } from "../../../../core/ecs/Entity";
import { EqSlot } from "../../../systems/eq/types";
import type { EqSlotEntity } from "./EqSlotEntity";
import { AmuletSlotEntity } from "./slots/AmuletSlotEntity";
import { ArmorSlotEntity } from "./slots/ArmorSlotEntity";
import { BootsSlotEntity } from "./slots/BootsSlotEntity";
import { HeadSlotEntity } from "./slots/HeadSlotEntity";
import { MainHandSlotEntity } from "./slots/MainHandSlotEntity";
import { OffhandSlotEntity } from "./slots/OffhandSlotEntity";
import { PantsSlotEntity } from "./slots/PantsSlotEntity";
import { RingSlotEntity } from "./slots/RingSlotEntity";

export const EQ_SLOT_TO_ENTITY = new Map<EqSlot, EntityClass<EqSlotEntity>>([
  [EqSlot.HEAD, HeadSlotEntity],
  [EqSlot.AMULET, AmuletSlotEntity],
  [EqSlot.MAIN_HAND, MainHandSlotEntity],
  [EqSlot.ARMOR, ArmorSlotEntity],
  [EqSlot.OFFHAND, OffhandSlotEntity],
  [EqSlot.RING1, RingSlotEntity],
  [EqSlot.PANTS, PantsSlotEntity],
  [EqSlot.RING2, RingSlotEntity],
  [EqSlot.BOOTS, BootsSlotEntity],
]);
