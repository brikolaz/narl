import type { Entity } from "../../../core/ecs/Entity";
import {
  getComponentByType,
  getComponentByType as getEntityByTypwe,
  hasComponentByType,
} from "../../../core/ecs/queries/component";
import {
  addEntity,
  getEntitiesByType,
  getEntityByType,
  patchEntityById,
} from "../../../core/ecs/queries/entities";
import { ContainerComponent } from "../../model/components/ContainerComponent";
import { SizeComponent } from "../../model/components/SizeComponent";
import { BackpackEntity } from "../../model/entities/items/BackpackEntity";
import { ItemEntity } from "../../model/entities/items/ItemEntity";
import type { InvSlot } from "../turn";

export const getBackpack = (entity: Entity): BackpackEntity | undefined => {
  return getEntityByType(entity, BackpackEntity);
};

export const isContainerFull = (entity: Entity): boolean => {
  const itemsInContainer = getEntitiesByType(entity, ItemEntity)?.length ?? 0;
  const containerSize = entity ? getContainerSize(entity) : undefined;
  const cointainerFull = itemsInContainer === containerSize;

  return cointainerFull;
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

export const isContainer = (entity: Entity) => {
  return hasComponentByType(entity, ContainerComponent);
};

export const getContainerSize = (entity: Entity) => {
  const size = getComponentByType(entity, SizeComponent)?.size;
  if (size === undefined) {
    throw new Error("Not a container");
  }
  return size;
};
