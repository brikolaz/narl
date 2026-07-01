import type { EntityClass } from "../../../../core/ecs/Entity";
import type { Factory } from "../../Factory";
import { BackpackEntity } from "./backpack/BackpackEntity";
import { BackpackEntityFactory } from "./backpack/BackpackEntityFactory";
import { HelmetEntity } from "./helmet/HelmetEntity";
import { HornedHelmetEntityFactory } from "./helmet/HelmetEntityFactory";
import type { ItemEntity } from "./ItemEntity";
import { RingEntity } from "./ring/RingEntity";
import { RingEntityFactory } from "./ring/RingEntityFactory";
import { SwordEntity, SwordEntityFactory } from "./SwordEntity";

export const ITEM_FACTORIES = new Map<
  EntityClass<ItemEntity>,
  Factory<ItemEntity>
>([
  [SwordEntity, SwordEntityFactory],
  [HelmetEntity, HornedHelmetEntityFactory],
  [BackpackEntity, BackpackEntityFactory],
  [RingEntity, RingEntityFactory],
]);
