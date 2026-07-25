import { getEntityCreator } from "../../../../../core/ecs/Entity";
import { upsertComponents } from "../../../../../core/ecs/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { HeadComponent } from "../../../components/eq/HeadComponent";
import { HeadSlotComponent } from "../../../components/eq/slots/HeadSlotComponent";
import { PositionComponent } from "../../../components/PositionComponent";
import type { ItemFactory } from "../../../Factory";

export const HeadSlotEntity = getEntityCreator("HEAD_SLOT");

export const HeadSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = HeadSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Head" }),
      HeadSlotComponent(),
      HeadComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
      PositionComponent({position: 1})
    );

    return eqSlot;
  },
};
