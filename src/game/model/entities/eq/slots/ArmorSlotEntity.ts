import { getEntityCreator } from "../../../../../core/ecs/Entity";
import { upsertComponents } from "../../../../../core/ecs/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { ArmorComponent } from "../../../components/eq/ArmorComponent";
import type { ItemFactory } from "../../../Factory";

export const ArmorSlotEntity = getEntityCreator("ARMOR_SLOT");

export const ArmorSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = ArmorSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Armor" }),
      ArmorComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
    );

    return eqSlot;
  },
};
