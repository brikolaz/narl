import { getEntityCreator } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { ChestComponent } from "../../../components/equipment/ChestComponent";
import { ChestSlotComponent } from "../../../components/equipment/slots/ChestSlotComponent";
import { PositionComponent } from "../../../components/spatial/PositionComponent";
import type { ItemFactory } from "../../../Factory";

const ChestSlotEntity = getEntityCreator("CHEST_SLOT");

export const ChestSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = ChestSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Chest" }),
      ChestSlotComponent(),
      ChestComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
      PositionComponent({ position: 3 }),
    );

    return eqSlot;
  },
};
