import type { Constructor } from "../../../../core/ecs/Constructor";
import type { Factory } from "../../Factory";
import { BackpackEntity, BackpackEntityFactory } from "./BackpackEntity";
import {
  HornedHelmetEntity,
  HornedHelmetEntityFactory,
} from "./HornedHelmetEntity";
import type { ItemEntity } from "./ItemEntity";
import { SwordEntity, SwordEntityFactory } from "./SwordEntity";

export type ItemClass = Constructor<ItemEntity>;

const ITEM_FACTORY = new Map<ItemClass, Factory<ItemEntity>>([
  [SwordEntity, SwordEntityFactory],
  [HornedHelmetEntity, HornedHelmetEntityFactory],
  [BackpackEntity, BackpackEntityFactory],
]);

export const getItemFactory = (itemClass: ItemClass) => {
  const factory = ITEM_FACTORY.get(itemClass);

  if (!factory) {
    throw new Error("Unknown item class");
  }

  return factory;
};
