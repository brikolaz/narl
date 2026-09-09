import { getEntityCreator } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { OffhandComponent } from "../../../components/equipment/OffhandComponent";
import { OffhandSlotComponent } from "../../../components/equipment/slots/OffhandSlotComponent";
import { PositionComponent } from "../../../components/spatial/PositionComponent";
import type { ItemFactory } from "../../../Factory";

const OffhandSlotEntity = getEntityCreator("OFFHAND_SLOT");

export const OffhandSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = OffhandSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Offhand" }),
      OffhandSlotComponent(),
      OffhandComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
      PositionComponent({ position: 4 }),
    );

    return eqSlot;
  },
};
