import { getEntityCreator, Entity, EntityRole } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { addRoleEntities } from "../../../../../core/ecs/queries/entities/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { EqSlotComponent } from "../../../components/eq/EqSlotComponent";
import { HeadComponent } from "../../../components/eq/HeadComponent";
import type { ItemFactory } from "../../../Factory";
import { PlaceholderEntityFactory } from "../../items/PlaceholderItemEntity";

export const HeadSlotEntity = getEntityCreator('HEAD_SLOT');

export const HeadSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = HeadSlotEntity();

    addComponents(
      eqSlot,
      NameComponent({ name: "Head" }),
      HeadComponent(),
      EqSlotComponent(),
      ContainerComponent(),
    );

    addRoleEntities(eqSlot, {
      [EntityRole.ITEM]: [PlaceholderEntityFactory.getDefault()],
    });

    return eqSlot;
  },
};
