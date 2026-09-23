import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../../core/model/queries/components/add"
import { ContainerComponent } from "../../../../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../../../../components/containers/SizeComponent"
import { NameComponent } from "../../../../../../components/display/NameComponent"
import { ChestComponent } from "../../../../../../components/equipment/ChestComponent"
import { ChestSlotComponent } from "../../../../../../components/equipment/slots/ChestSlotComponent"
import { PositionComponent } from "../../../../../../components/spatial/PositionComponent"
const addComponents = (chestSlot: Entity<"CHEST_SLOT">): void => {
  upsertComponents(
    chestSlot,
    NameComponent({ name: "Chest" }),
    ChestSlotComponent(),
    ChestComponent(),
    ContainerComponent(),
    SizeComponent({ size: 1 }),
    PositionComponent({ position: 3 }),
  )
}
const addLoot = (chestSlot: Entity<"CHEST_SLOT">): void => {
  void chestSlot
}
const addEq = (chestSlot: Entity<"CHEST_SLOT">): void => {
  void chestSlot
}
export const ChestSlotEntity = getEntityCreator("CHEST_SLOT", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
