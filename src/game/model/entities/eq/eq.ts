import type { ComponentType } from "../../../../core/model/Component";
import { ChestSlotComponent } from "../../components/equipment/slots/ChestSlotComponent";
import { BootsSlotComponent } from "../../components/equipment/slots/BootsSlotComponent";
import { HeadSlotComponent } from "../../components/equipment/slots/HeadSlotComponent";
import { MainHandSlotComponent } from "../../components/equipment/slots/MainHandSlotComponent";
import { OffhandSlotComponent } from "../../components/equipment/slots/OffhandSlotComponent";
import { PantsSlotComponent } from "../../components/equipment/slots/PantsSlotComponent";

export const EQ_SLOT_COMPONENTS = new Set<ComponentType>([
  HeadSlotComponent.type,
  MainHandSlotComponent.type,
  ChestSlotComponent.type,
  OffhandSlotComponent.type,
  PantsSlotComponent.type,
  BootsSlotComponent.type,
]);
