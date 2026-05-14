import { getEntitiesByType } from "../../../core/ecs/queries/entities";
import type { BackpackEntity } from "../../model/entities/items/BackpackEntity";
import { ItemEntity } from "../../model/entities/items/ItemEntity";
import type { InvSlot } from "./types";

export const getInvItemAt = (backpack: BackpackEntity, slot: InvSlot) => {
  const items = getEntitiesByType(backpack, ItemEntity);
  return items[slot - 1];
};
