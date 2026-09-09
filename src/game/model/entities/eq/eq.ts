import type { ComponentType } from "../../../../core/model/Component";
import { ChestSlotComponent } from "../../components/eq/slots/ChestSlotComponent";
import { BootsSlotComponent } from "../../components/eq/slots/BootsSlotComponent";
import { HeadSlotComponent } from "../../components/eq/slots/HeadSlotComponent";
import { MainHandSlotComponent } from "../../components/eq/slots/MainHandSlotComponent";
import { OffhandSlotComponent } from "../../components/eq/slots/OffhandSlotComponent";
import { PantsSlotComponent } from "../../components/eq/slots/PantsSlotComponent";

export const EQ_SLOT_COMPONENTS = new Set<ComponentType>([
  HeadSlotComponent.type,
  MainHandSlotComponent.type,
  ChestSlotComponent.type,
  OffhandSlotComponent.type,
  PantsSlotComponent.type,
  BootsSlotComponent.type,
]);
