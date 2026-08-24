import type { ComponentType } from "../../../../core/model/Component";
import { ArmorSlotComponent } from "../../components/eq/slots/ArmorSlotComponent";
import { BootsSlotComponent } from "../../components/eq/slots/BootsSlotComponent";
import { HeadSlotComponent } from "../../components/eq/slots/HeadSlotComponent";
import { MainHandSlotComponent } from "../../components/eq/slots/MainHandSlotComponent";
import { OffhandSlotComponent } from "../../components/eq/slots/OffhandSlotComponent";
import { PantsSlotComponent } from "../../components/eq/slots/PantsSlotComponent";

export const EQ_SLOT_COMPONENTS = new Set<ComponentType>([
  HeadSlotComponent.type,
  MainHandSlotComponent.type,
  ArmorSlotComponent.type,
  OffhandSlotComponent.type,
  PantsSlotComponent.type,
  BootsSlotComponent.type,
]);
