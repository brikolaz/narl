import { EntityRole, getEntityCreator } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { upsertRoleEntities } from "../../../../../core/ecs/queries/entities/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { NameComponent } from "../../../components/display/NameComponent";
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
      ContainerComponent(),
    );

    upsertRoleEntities(eqSlot, {
      [EntityRole.ITEM]: [PlaceholderEntityFactory.getDefault()],
    });

    return eqSlot;
  },
};
