import { getEntityCreator } from "../../../../../core/ecs/Entity";
import { upsertComponents } from "../../../../../core/ecs/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { AmuletComponent } from "../../../components/eq/AmuletComponent";
import type { ItemFactory } from "../../../Factory";

export const AmuletSlotEntity = getEntityCreator("AMULET_SLOT");

export const AmuletSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const amuletSlot = AmuletSlotEntity();

    upsertComponents(
      amuletSlot,
      NameComponent({ name: "Amulet" }),
      AmuletComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
    );

    return amuletSlot;
  },
};
