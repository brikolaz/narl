import type { EntityType } from "../../../../../core/model/Entity"
import type { Manual } from "../../../Manual"
import { PantsSlotEntity } from "./pantsSlot/variants/PantsSlot/PantsSlotEntity"
import { PantsSlotEntityManual } from "./pantsSlot/variants/PantsSlot/PantsSlotEntityManual"

export const EQ_SLOTS_MANUALS = new Map<EntityType, Manual>([
  [PantsSlotEntity.type, PantsSlotEntityManual],
])
