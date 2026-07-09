import type { EntityType } from "../../../../core/ecs/Entity";
import type { Manual } from "../../Manual";
import { ContainerEntity } from "./container/ContainerEntity";
import { ContainerEntityManual } from "./container/ContainerEntityManual";
import { HelmetEntity } from "./helmet/HelmetEntity";
import { HelmetEntityManual } from "./helmet/HelmetEntityManual";
import { RingEntity } from "./ring/RingEntity";
import { RingEntityManual } from "./ring/RingEntityManual";

export const ITEM_MANUALS = new Map<EntityType, Manual>([
  [HelmetEntity.type, HelmetEntityManual],
  [ContainerEntity.type, ContainerEntityManual],
  [RingEntity.type, RingEntityManual],
]);
