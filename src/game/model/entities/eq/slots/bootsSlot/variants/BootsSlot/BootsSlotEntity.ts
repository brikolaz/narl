import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../../core/model/queries/components/add"
import { ContainerComponent } from "../../../../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../../../../components/containers/SizeComponent"
import { NameComponent } from "../../../../../../components/display/NameComponent"
import { BootsComponent } from "../../../../../../components/equipment/BootsComponent"
import { BootsSlotComponent } from "../../../../../../components/equipment/slots/BootsSlotComponent"
import { PositionComponent } from "../../../../../../components/spatial/PositionComponent"
const addComponents = (bootsSlot: Entity<"BOOTS_SLOT">): void => {
  upsertComponents(
    bootsSlot,
    NameComponent({ name: "Boots" }),
    BootsSlotComponent(),
    BootsComponent(),
    ContainerComponent(),
    SizeComponent({ size: 1 }),
    PositionComponent({ position: 6 }),
  )
}
const addLoot = (bootsSlot: Entity<"BOOTS_SLOT">): void => {
  void bootsSlot
}
const addEq = (bootsSlot: Entity<"BOOTS_SLOT">): void => {
  void bootsSlot
}
export const BootsSlotEntity = getEntityCreator("BOOTS_SLOT", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
