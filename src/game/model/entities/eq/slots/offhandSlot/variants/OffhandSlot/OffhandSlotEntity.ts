import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../../core/model/queries/components/add"
import { ContainerComponent } from "../../../../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../../../../components/containers/SizeComponent"
import { NameComponent } from "../../../../../../components/display/NameComponent"
import { OffhandComponent } from "../../../../../../components/equipment/OffhandComponent"
import { OffhandSlotComponent } from "../../../../../../components/equipment/slots/OffhandSlotComponent"
import { PositionComponent } from "../../../../../../components/spatial/PositionComponent"
const addComponents = (offhandSlot: Entity<"OFFHAND_SLOT">): void => {
  upsertComponents(
    offhandSlot,
    NameComponent({ name: "Offhand" }),
    OffhandSlotComponent(),
    OffhandComponent(),
    ContainerComponent(),
    SizeComponent({ size: 1 }),
    PositionComponent({ position: 4 }),
  )
}
const addLoot = (offhandSlot: Entity<"OFFHAND_SLOT">): void => {
  void offhandSlot
}
const addEq = (offhandSlot: Entity<"OFFHAND_SLOT">): void => {
  void offhandSlot
}
export const OffhandSlotEntity = getEntityCreator("OFFHAND_SLOT", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
