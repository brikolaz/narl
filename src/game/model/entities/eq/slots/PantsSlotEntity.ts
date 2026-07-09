import { getEntityCreator, Entity, EntityRole } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { addRoleEntities } from "../../../../../core/ecs/queries/entities/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { EqSlotComponent } from "../../../components/eq/EqSlotComponent";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import type { ItemFactory } from "../../../Factory";
import { PlaceholderEntityFactory } from "../../items/PlaceholderItemEntity";

export const PantsSlotEntity = getEntityCreator('PANTS_SLOT');

export const PantsSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = PantsSlotEntity();

    addComponents(
      eqSlot,
      NameComponent({ name: "Pants" }),
      PantsComponent(),
      RingComponent(),
      EqSlotComponent(),
      ContainerComponent(),
    );

    addRoleEntities(eqSlot, {
      [EntityRole.ITEM]: [PlaceholderEntityFactory.getDefault()],
    });

    return eqSlot;
  },
};
