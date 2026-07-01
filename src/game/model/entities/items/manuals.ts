import type { EntityClass } from "../../../../core/ecs/Entity";
import type { Manual } from "../../Manual";
import { BackpackEntity } from "./backpack/BackpackEntity";
import { BackpackEntityManual } from "./backpack/BackpackEntityManual";
import { HelmetEntity } from "./helmet/HelmetEntity";
import { HelmetEntityManual } from "./helmet/HelmetEntityManual";
import { ItemEntity } from "./ItemEntity";
import { RingEntity } from "./ring/RingEntity";
import { RingEntityManual } from "./ring/RingEntityManual";

export const ITEM_MANUALS = new Map<
  EntityClass<ItemEntity>,
  Manual<ItemEntity>
>([
  [HelmetEntity, HelmetEntityManual],
  [BackpackEntity, BackpackEntityManual],
  [RingEntity, RingEntityManual],
]);
