import { getEntityCreator } from "../../../../../core/ecs/Entity";
import { upsertComponents } from "../../../../../core/ecs/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { OffhandComponent } from "../../../components/eq/OffhandComponent";
import type { ItemFactory } from "../../../Factory";

export const OffhandSlotEntity = getEntityCreator("OFFHAND_SLOT");

export const OffhandSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = OffhandSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Offhand" }),
      OffhandComponent(),
      ContainerComponent(),
            SizeComponent({ size: 1 }),
      
    );

    return eqSlot;
  },
};
