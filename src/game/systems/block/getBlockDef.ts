import type { Entity } from "../../../core/model/Entity"
import { BARE_BLOCK } from "../../../utils/constants"
import { MainHandSlotComponent } from "../../model/components/equipment/slots/MainHandSlotComponent"
import { OffhandSlotComponent } from "../../model/components/equipment/slots/OffhandSlotComponent"
import { getContainerItems } from "../containers/containers"
import { getDef } from "../def/def"
import { getEqSlotByType } from "../eq/eq"

export const getBlockDef = (entity: Entity): number => {
  const handItems = [MainHandSlotComponent, OffhandSlotComponent].flatMap(
    (slotType) => getContainerItems(getEqSlotByType(entity, slotType)),
  )
  const handsDef = handItems.reduce(
    (total, item) => total + Math.max(BARE_BLOCK, getDef(item)),
    0,
  )

  return handsDef
}
