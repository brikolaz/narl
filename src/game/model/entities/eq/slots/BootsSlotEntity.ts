import { getEntityCreator } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { BootsComponent } from "../../../components/eq/BootsComponent";
import type { ItemFactory } from "../../../Factory";

export const BootsSlotEntity = getEntityCreator("BOOTS_SLOT");

export const BootsSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = BootsSlotEntity();

    addComponents(
      eqSlot,
      NameComponent({ name: "Boots" }),
      BootsComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
    );

    return eqSlot;
  },
};
