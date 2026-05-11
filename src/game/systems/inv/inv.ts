import { getEntitiesByType } from "../../../core/ecs";
import { ItemEntity, type BackpackEntity } from "../../model";
import type { InvSlot } from "../turn";

export const getInvItemAt = (backpack: BackpackEntity, slot: InvSlot) => {
  const items = getEntitiesByType(backpack, ItemEntity);
  return items[slot - 1];
};
