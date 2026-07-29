import { getEntityCreator } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { OffhandComponent } from "../../../components/eq/OffhandComponent";
import { OffhandSlotComponent } from "../../../components/eq/slots/OffhandSlotComponent";
import { PositionComponent } from "../../../components/PositionComponent";
import type { ItemFactory } from "../../../Factory";

export const OffhandSlotEntity = getEntityCreator("OFFHAND_SLOT");

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
