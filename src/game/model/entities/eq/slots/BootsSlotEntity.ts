import { getEntityCreator } from "../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../core/model/queries/components/add"
import { ContainerComponent } from "../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../components/containers/SizeComponent"
import { NameComponent } from "../../../components/display/NameComponent"
import { BootsComponent } from "../../../components/equipment/BootsComponent"
import { BootsSlotComponent } from "../../../components/equipment/slots/BootsSlotComponent"
import { PositionComponent } from "../../../components/spatial/PositionComponent"
import type { ItemFactory } from "../../../Factory"

const BootsSlotEntity = getEntityCreator("BOOTS_SLOT")
export type BootsSlotEntityVariants = typeof BootsSlotEntity.type

export const BootsSlotEntityFactory: ItemFactory<BootsSlotEntityVariants> = {
  getDefault: () => {
    const bootsSlot = BootsSlotEntity()

    upsertComponents(
      bootsSlot,
      NameComponent({ name: "Boots" }),
      BootsSlotComponent(),
      BootsComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
      PositionComponent({ position: 6 }),
    )

    return bootsSlot
  },
}
