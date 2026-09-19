import { getEntityCreator } from "../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../core/model/queries/components/add"
import { ContainerComponent } from "../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../components/containers/SizeComponent"
import { NameComponent } from "../../../components/display/NameComponent"
import { MainHandComponent } from "../../../components/equipment/MainHandComponent"
import { MainHandSlotComponent } from "../../../components/equipment/slots/MainHandSlotComponent"
import { PositionComponent } from "../../../components/spatial/PositionComponent"
import type { ItemFactory } from "../../../Factory"

const MainHandSlotEntity = getEntityCreator("MAIN_HAND_SLOT")
export type MainHandSlotEntityVariants = typeof MainHandSlotEntity.type

export const MainHandSlotEntityFactory: ItemFactory<MainHandSlotEntityVariants> =
  {
    getDefault: () => {
      const mainHandSlot = MainHandSlotEntity()

      upsertComponents(
        mainHandSlot,
        NameComponent({ name: "Main Hand" }),
        MainHandSlotComponent(),
        MainHandComponent(),
        ContainerComponent(),
        SizeComponent({ size: 1 }),
        PositionComponent({ position: 2 }),
      )

      return mainHandSlot
    },
  }
