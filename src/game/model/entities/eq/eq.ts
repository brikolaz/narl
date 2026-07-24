import { EntityRole, type Entity } from "../../../../core/ecs/Entity";
import { upsertRoleEntities } from "../../../../core/ecs/queries/entities/add";
import { AmuletSlotEntityFactory } from "./slots/AmuletSlotEntity";
import { ArmorSlotEntityFactory } from "./slots/ArmorSlotEntity";
import { BootsSlotEntityFactory } from "./slots/BootsSlotEntity";
import { HeadSlotEntityFactory } from "./slots/HeadSlotEntity";
import { MainHandSlotEntityFactory } from "./slots/MainHandSlotEntity";
import { OffhandSlotEntityFactory } from "./slots/OffhandSlotEntity";
import { PantsSlotEntityFactory } from "./slots/pantsSlot/PantsSlotEntity";
import { RingSlotEntityFactory } from "./slots/RingSlotEntity";

export const initEq = (entity: Entity) => {
  upsertRoleEntities(entity, {
    [EntityRole.EQ]: [
      HeadSlotEntityFactory.getDefault(),
      AmuletSlotEntityFactory.getDefault(),
      MainHandSlotEntityFactory.getDefault(),
      ArmorSlotEntityFactory.getDefault(),
      OffhandSlotEntityFactory.getDefault(),
      RingSlotEntityFactory.getDefault(),
      PantsSlotEntityFactory.getDefault(),
      RingSlotEntityFactory.getDefault(),
      BootsSlotEntityFactory.getDefault(),
    ],
  });
};
