import { getEntityCreator, EntityRole } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { addRoleEntities } from "../../../../../core/ecs/queries/entities/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { BootsComponent } from "../../../components/eq/BootsComponent";
import { EqSlotComponent } from "../../../components/eq/EqSlotComponent";
import type { ItemFactory } from "../../../Factory";
import { PlaceholderEntityFactory } from "../../items/PlaceholderItemEntity";

export const BootsSlotEntity = getEntityCreator('BOOTS_SLOT');

export const BootsSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = BootsSlotEntity();

    addComponents(
      eqSlot,
      NameComponent({ name: "Boots" }),
      BootsComponent(),
      EqSlotComponent(),
      ContainerComponent(),
    );

    addRoleEntities(eqSlot, {
      [EntityRole.ITEM]: [PlaceholderEntityFactory.getDefault()],
    });

    return eqSlot;
  },
};
