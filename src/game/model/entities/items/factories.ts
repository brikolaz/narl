import type { EntityType } from "../../../../core/ecs/Entity";
import type { ItemFactory } from "../../Factory";
import {
  ContainerEntity,
  ContainerEntityFactory,
} from "./container/ContainerEntity";
import { HelmetEntity, HelmetEntityFactory } from "./helmet/HelmetEntity";
import { RingEntity, RingEntityFactory } from "./ring/RingEntity";
import { SwordEntity, SwordEntityFactory } from "./SwordEntity";

export const ITEM_FACTORIES = new Map<EntityType, ItemFactory>([
  [SwordEntity.type, SwordEntityFactory],
  [HelmetEntity.type, HelmetEntityFactory],
  [ContainerEntity.type, ContainerEntityFactory],
  [RingEntity.type, RingEntityFactory],
]);
