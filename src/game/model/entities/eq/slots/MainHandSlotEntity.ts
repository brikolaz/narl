import { getEntityCreator, Entity, EntityRole } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { addRoleEntities } from "../../../../../core/ecs/queries/entities/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { EqSlotComponent } from "../../../components/eq/EqSlotComponent";
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
      EqSlotComponent(),
      ContainerComponent(),
    );

    addRoleEntities(eqSlot, {
      [EntityRole.ITEM]: [PlaceholderEntityFactory.getDefault()],
    });

    return eqSlot;
  },
};
