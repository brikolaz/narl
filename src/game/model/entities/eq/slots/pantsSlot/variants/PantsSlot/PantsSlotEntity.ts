import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../../core/model/queries/components/add"
import { ContainerComponent } from "../../../../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../../../../components/containers/SizeComponent"
import { NameComponent } from "../../../../../../components/display/NameComponent"
import { PantsComponent } from "../../../../../../components/equipment/PantsComponent"
import { PantsSlotComponent } from "../../../../../../components/equipment/slots/PantsSlotComponent"
import { PositionComponent } from "../../../../../../components/spatial/PositionComponent"
const addComponents = (pantsSlot: Entity<"PANTS_SLOT">): void => {
  upsertComponents(
    pantsSlot,
    NameComponent({ name: "Pants" }),
    PantsSlotComponent(),
    PantsComponent(),
    ContainerComponent(),
    SizeComponent({ size: 1 }),
    PositionComponent({ position: 5 }),
  )
}
const addLoot = (pantsSlot: Entity<"PANTS_SLOT">): void => {
  void pantsSlot
}
const addEq = (pantsSlot: Entity<"PANTS_SLOT">): void => {
  void pantsSlot
}
export const PantsSlotEntity = getEntityCreator("PANTS_SLOT", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
