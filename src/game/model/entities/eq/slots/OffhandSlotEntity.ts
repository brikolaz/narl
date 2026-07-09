import { NameComponent } from "../../../components/display/NameComponent";
import { OffhandComponent } from "../../../components/eq/OffhandComponent";
import { getEntityCreator, Entity, EntityRole } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { addRoleEntities } from "../../../../../core/ecs/queries/entities/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { EqSlotComponent } from "../../../components/eq/EqSlotComponent";
import type { ItemFactory } from "../../../Factory";
import { PlaceholderEntityFactory } from "../../items/PlaceholderItemEntity";

export const OffhandSlotEntity = getEntityCreator('OFFHAND_SLOT');

export const OffhandSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = OffhandSlotEntity();

    addComponents(
      eqSlot,
      NameComponent({ name: "Offhand" }),
      OffhandComponent(),
      EqSlotComponent(),
      ContainerComponent(),
    );

    addRoleEntities(eqSlot, {
      [EntityRole.ITEM]: [PlaceholderEntityFactory.getDefault()],
    });

    return eqSlot;
  },
};
