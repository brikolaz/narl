import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../../core/model/queries/components/add"
import { ContainerComponent } from "../../../../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../../../../components/containers/SizeComponent"
import { NameComponent } from "../../../../../../components/display/NameComponent"
import { MainHandComponent } from "../../../../../../components/equipment/MainHandComponent"
import { MainHandSlotComponent } from "../../../../../../components/equipment/slots/MainHandSlotComponent"
import { PositionComponent } from "../../../../../../components/spatial/PositionComponent"
const addComponents = (mainHandSlot: Entity<"MAIN_HAND_SLOT">): void => {
  upsertComponents(
    mainHandSlot,
    NameComponent({ name: "Main Hand" }),
    MainHandSlotComponent(),
    MainHandComponent(),
    ContainerComponent(),
    SizeComponent({ size: 1 }),
    PositionComponent({ position: 2 }),
  )
}
const addLoot = (mainHandSlot: Entity<"MAIN_HAND_SLOT">): void => {
  void mainHandSlot
}
const addEq = (mainHandSlot: Entity<"MAIN_HAND_SLOT">): void => {
  void mainHandSlot
}
export const MainHandSlotEntity = getEntityCreator("MAIN_HAND_SLOT", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
