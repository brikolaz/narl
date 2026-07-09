import { EntityRole, getEntityCreator } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { upsertRoleEntities } from "../../../../../core/ecs/queries/entities/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { AmuletComponent } from "../../../components/eq/AmuletComponent";
import type { ItemFactory } from "../../../Factory";
import { PlaceholderEntityFactory } from "../../items/PlaceholderItemEntity";

export const AmuletSlotEntity = getEntityCreator("AMULET_SLOT");

export const AmuletSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const amuletSlot = AmuletSlotEntity();

    addComponents(
      amuletSlot,
      NameComponent({ name: "Amulet" }),
      AmuletComponent(),
      ContainerComponent(),
    );

    upsertRoleEntities(amuletSlot, {
      [EntityRole.ITEM]: [PlaceholderEntityFactory.getDefault()],
    });

    return amuletSlot;
  },
};
