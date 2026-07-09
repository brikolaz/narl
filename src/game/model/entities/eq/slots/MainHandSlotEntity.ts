import { EntityRole, getEntityCreator } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { upsertRoleEntities } from "../../../../../core/ecs/queries/entities/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { MainHandComponent } from "../../../components/eq/MainHandComponent";
import type { ItemFactory } from "../../../Factory";
import { PlaceholderEntityFactory } from "../../items/PlaceholderItemEntity";

export const MainHandSlotEntity = getEntityCreator('MAIN_HAND_SLOT');

export const MainHandSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = MainHandSlotEntity();

    addComponents(
      eqSlot,
      NameComponent({ name: "Main Hand" }),
      MainHandComponent(),
      ContainerComponent(),
    );

    upsertRoleEntities(eqSlot, {
      [EntityRole.ITEM]: [PlaceholderEntityFactory.getDefault()],
    });

    return eqSlot;
  },
};
