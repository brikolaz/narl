import {
  getEntityCreator,
  Entity,
  EntityRole,
} from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import { addRoleEntities } from "../../../../../core/ecs/queries/entities/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { EqSlotComponent } from "../../../components/eq/EqSlotComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import type { ItemFactory } from "../../../Factory";
import { PlaceholderEntityFactory } from "../../items/PlaceholderItemEntity";

export const RingSlotEntity = getEntityCreator("RING_SLOT");

export const RingSlotEntityFactory: ItemFactory = {
  getDefault: () => {
    const eqSlot = RingSlotEntity();

    addComponents(
      eqSlot,
      NameComponent({ name: "Ring" }),
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
