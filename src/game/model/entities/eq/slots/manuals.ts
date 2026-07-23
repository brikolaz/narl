import type { EntityType } from "../../../../../core/ecs/Entity";
import type { Manual } from "../../../Manual";
import { PantsSlotEntity } from "./pantsSlot/PantsSlotEntity";
import { PantsSlotEntityManual } from "./pantsSlot/PantsSlotEntityManual";

export const EQ_SLOTS_MANUALS = new Map<EntityType, Manual>([
  [PantsSlotEntity.type, PantsSlotEntityManual],
]);
