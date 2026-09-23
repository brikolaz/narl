import {
  getEntityCreator,
  type Entity,
} from "../../../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../../../core/model/queries/components/add"
import { ContainerComponent } from "../../../../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../../../../components/containers/SizeComponent"
import { NameComponent } from "../../../../../../components/display/NameComponent"
import { HeadComponent } from "../../../../../../components/equipment/HeadComponent"
import { HeadSlotComponent } from "../../../../../../components/equipment/slots/HeadSlotComponent"
import { PositionComponent } from "../../../../../../components/spatial/PositionComponent"
const addComponents = (headSlot: Entity<"HEAD_SLOT">): void => {
  upsertComponents(
    headSlot,
    NameComponent({ name: "Head" }),
    HeadSlotComponent(),
    HeadComponent(),
    ContainerComponent(),
    SizeComponent({ size: 1 }),
    PositionComponent({ position: 1 }),
  )
}
const addLoot = (headSlot: Entity<"HEAD_SLOT">): void => {
  void headSlot
}
const addEq = (headSlot: Entity<"HEAD_SLOT">): void => {
  void headSlot
}
export const HeadSlotEntity = getEntityCreator("HEAD_SLOT", {
  components: addComponents,
  eq: addEq,
  loot: addLoot,
})
