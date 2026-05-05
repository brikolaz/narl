import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType as getEntityByTypwe } from "../../../core/ecs/queries/component";
import {
  addEntity,
  getEntitiesByType,
  getEntityByType,
  patchEntityById,
} from "../../../core/ecs/queries/entities";
import { SizeComponent } from "../../model/components/SizeComponent";
import { BackpackEntity } from "../../model/entities/items/BackpackEntity";
import { ItemEntity } from "../../model/entities/items/ItemEntity";
import type { InvSlot } from "../turn";

export const getBackpack = (entity: ItemEntity): BackpackEntity | undefined => {
  return getEntityByType(entity, BackpackEntity);
};

export const isBackpackFull = (backpack: BackpackEntity): boolean => {
  const itemsInBackpack = getEntitiesByType(backpack, ItemEntity)?.length ?? 0;
  const backpackSize = getEntityByTypwe(backpack, SizeComponent)?.size ?? 0;
  const backpackIsFull = itemsInBackpack === backpackSize;

  return backpackIsFull;
};

// TODO: make backpackId optional (if real use case found)
export const addItemToEntityBackpack = (
  entity: Entity,
  item: ItemEntity,
  backpackId: string,
): void => {
  patchEntityById(entity, backpackId, (backpack) => addEntity(backpack, item));
};

export const getBackpackItem = (
  backpack: BackpackEntity,
  slot: InvSlot,
): ItemEntity | undefined => {
  return backpack.entities[slot - 1];
};
