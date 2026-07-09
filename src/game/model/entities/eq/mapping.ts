import type { EntityType } from "../../../../core/ecs/Entity";
import { EqSlot } from "../../../systems/eq/types";
import { AmuletSlotEntity } from "./slots/AmuletSlotEntity";
import { ArmorSlotEntity } from "./slots/ArmorSlotEntity";
import { BootsSlotEntity } from "./slots/BootsSlotEntity";
import { HeadSlotEntity } from "./slots/HeadSlotEntity";
import { MainHandSlotEntity } from "./slots/MainHandSlotEntity";
import { OffhandSlotEntity } from "./slots/OffhandSlotEntity";
import { PantsSlotEntity } from "./slots/PantsSlotEntity";
import { RingSlotEntity } from "./slots/RingSlotEntity";

// ORDER IS IMPORTANT
export const EQ_SLOT_TO_ENTITY = new Map<EqSlot, EntityType>([
  [EqSlot.HEAD, HeadSlotEntity.type],
  [EqSlot.AMULET, AmuletSlotEntity.type],
  [EqSlot.MAIN_HAND, MainHandSlotEntity.type],
  [EqSlot.ARMOR, ArmorSlotEntity.type],
  [EqSlot.OFFHAND, OffhandSlotEntity.type],
  [EqSlot.RING1, RingSlotEntity.type],
  [EqSlot.PANTS, PantsSlotEntity.type],
  [EqSlot.RING2, RingSlotEntity.type],
  [EqSlot.BOOTS, BootsSlotEntity.type],
]);
