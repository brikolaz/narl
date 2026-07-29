import { getEntityCreator } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { ArmorComponent } from "../../../components/eq/ArmorComponent";
import { ArmorSlotComponent } from "../../../components/eq/slots/ArmorSlotComponent";
import { PositionComponent } from "../../../components/PositionComponent";
import type { ItemFactory } from "../../../Factory";

export const ArmorSlotEntity = getEntityCreator("ARMOR_SLOT");

export const ArmorSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = ArmorSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Armor" }),
      ArmorSlotComponent(),
      ArmorComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
      PositionComponent({ position: 3 }),
    );

    return eqSlot;
  },
};
