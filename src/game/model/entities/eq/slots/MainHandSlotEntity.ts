import { getEntityCreator } from "../../../../../core/ecs/Entity";
import { upsertComponents } from "../../../../../core/ecs/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { MainHandComponent } from "../../../components/eq/MainHandComponent";
import type { ItemFactory } from "../../../Factory";

export const MainHandSlotEntity = getEntityCreator("MAIN_HAND_SLOT");

export const MainHandSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = MainHandSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Main Hand" }),
      MainHandComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
    );

    return eqSlot;
  },
};
