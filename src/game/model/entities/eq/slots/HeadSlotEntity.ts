import { getEntityCreator } from "../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../core/model/queries/components/add"
import { ContainerComponent } from "../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../components/containers/SizeComponent"
import { NameComponent } from "../../../components/display/NameComponent"
import { HeadComponent } from "../../../components/equipment/HeadComponent"
import { HeadSlotComponent } from "../../../components/equipment/slots/HeadSlotComponent"
import { PositionComponent } from "../../../components/spatial/PositionComponent"
import type { ItemFactory } from "../../../Factory"

const HeadSlotEntity = getEntityCreator("HEAD_SLOT")

export const HeadSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const headSlot = HeadSlotEntity()

    upsertComponents(
      headSlot,
      NameComponent({ name: "Head" }),
      HeadSlotComponent(),
      HeadComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
      PositionComponent({ position: 1 }),
    )

    return headSlot
  },
}
