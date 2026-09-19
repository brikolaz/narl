import { getEntityCreator } from "../../../../../../core/model/Entity"
import { upsertComponents } from "../../../../../../core/model/queries/components/add"
import { ContainerComponent } from "../../../../components/containers/ContainerComponent"
import { SizeComponent } from "../../../../components/containers/SizeComponent"
import { NameComponent } from "../../../../components/display/NameComponent"
import { PantsComponent } from "../../../../components/equipment/PantsComponent"
import { PantsSlotComponent } from "../../../../components/equipment/slots/PantsSlotComponent"
import { PositionComponent } from "../../../../components/spatial/PositionComponent"
import type { ItemFactory } from "../../../../Factory"

export const PantsSlotEntity = getEntityCreator("PANTS_SLOT")
export type PantsSlotEntityVariants = typeof PantsSlotEntity.type

export const PantsSlotEntityFactory: ItemFactory<PantsSlotEntityVariants> = {
  getDefault: () => {
    const pantsSlot = PantsSlotEntity()

    upsertComponents(
      pantsSlot,
      NameComponent({ name: "Pants" }),
      PantsSlotComponent(),
      PantsComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
      PositionComponent({ position: 5 }),
    )

    return pantsSlot
  },
}
