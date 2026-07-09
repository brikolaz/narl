import { getEntityCreator, EntityRole } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { addRoleEntities } from "../../../../../core/ecs/queries/entities/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { ArmorComponent } from "../../../components/eq/ArmorComponent";
import { EqSlotComponent } from "../../../components/eq/EqSlotComponent";
import type { ItemFactory } from "../../../Factory";
import { PlaceholderEntityFactory } from "../../items/PlaceholderItemEntity";

export const ArmorSlotEntity = getEntityCreator("ARMOR_SLOT");

export const ArmorSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = ArmorSlotEntity();

    addComponents(
      eqSlot,
      NameComponent({ name: "Armor" }),
      ArmorComponent(),
      EqSlotComponent(),
      ContainerComponent(),
    );

    addRoleEntities(eqSlot, {
      [EntityRole.ITEM]: [PlaceholderEntityFactory.getDefault()],
    });

    return eqSlot;
  },
};
