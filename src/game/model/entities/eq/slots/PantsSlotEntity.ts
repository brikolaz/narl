import { getEntityCreator } from "../../../../../core/ecs/Entity";
import { upsertComponents } from "../../../../../core/ecs/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import type { ItemFactory } from "../../../Factory";

export const PantsSlotEntity = getEntityCreator("PANTS_SLOT");

export const PantsSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = PantsSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Pants" }),
      PantsComponent(),
      RingComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
    );

    return eqSlot;
  },
};
