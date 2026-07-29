import { getEntityCreator } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { MainHandComponent } from "../../../components/eq/MainHandComponent";
import { MainHandSlotComponent } from "../../../components/eq/slots/MainHandSlotComponent";
import { PositionComponent } from "../../../components/PositionComponent";
import type { ItemFactory } from "../../../Factory";

export const MainHandSlotEntity = getEntityCreator("MAIN_HAND_SLOT");

export const MainHandSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = MainHandSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Main Hand" }),
      MainHandSlotComponent(),
      MainHandComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
      PositionComponent({ position: 2 }),
    );

    return eqSlot;
  },
};
