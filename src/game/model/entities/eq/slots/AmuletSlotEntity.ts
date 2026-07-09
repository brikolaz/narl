import { getEntityCreator } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { NameComponent } from "../../../components/display/NameComponent";
import { AmuletComponent } from "../../../components/eq/AmuletComponent";
import type { ItemFactory } from "../../../Factory";

export const AmuletSlotEntity = getEntityCreator("AMULET_SLOT");

export const AmuletSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const amuletSlot = AmuletSlotEntity();

    addComponents(
      amuletSlot,
      NameComponent({ name: "Amulet" }),
      AmuletComponent(),
    );

    return amuletSlot;
  },
};
