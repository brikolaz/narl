import type { Entity } from "../../../core/ecs/Entity";
import {
  getComponentByType,
  hasComponentByType,
} from "../../../core/ecs/queries/component";
import {
  getEntitiesByType,
  getEntityById,
  getEntityByType,
  replaceEntityById,
} from "../../../core/ecs/queries/entities";
import { DEFAULT_NEST_DEPTH } from "../../../utils";
import { ContainerComponent } from "../../model/components/ContainerComponent";
import { NestDepthComponent } from "../../model/components/NestDepthComponent";
import { PlaceholderComponent } from "../../model/components/PlaceholderComponent";
import { SizeComponent } from "../../model/components/SizeComponent";
import { BackpackEntity } from "../../model/entities/items/BackpackEntity";
import { ItemEntity } from "../../model/entities/items/ItemEntity";
import { PlaceholderEntity } from "../../model/entities/items/PlaceholderItemEntity";

export type ContainerSlot = number;

// TODO: remove backpack functions
// use generic container funcs
// add getPlayerBackpack(gameState)

export const getBackpack = (entity: Entity): BackpackEntity | undefined => {
  return getEntityByType(entity, BackpackEntity);
};

export const isContainerFull = (container: Entity): boolean => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return getFirstEmptyContainerSlot(container) === undefined;
};

export const addItemToEntityBackpack = (
  entity: Entity,
  item: ItemEntity,
): void => {
  const backpack = getBackpack(entity);
  if (!backpack) {
    throw new Error("No backpack");
  }
  const slot = getFirstEmptyContainerSlot(backpack);
  if (!slot) {
    throw new Error("Backpack is full");
  }
  setContainerItemAt(backpack, slot, item);
};

export const addItemToContainer = (
  container: Entity,
  item: ItemEntity,
): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const slot = getFirstEmptyContainerSlot(container);
  if (!slot) {
    throw new Error("Container is full");
  }
  setContainerItemAt(container, slot, item);
};

export const getContainerItemAt = (
  container: Entity,
  containerSlot: ContainerSlot,
): ItemEntity | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const item = container.entities[containerSlot - 1];
  if (!item) {
    throw new Error(`No container item at slot ${containerSlot}`);
  }
  if (isPlaceholderSlot(item)) {
    return undefined;
  }

  return item as ItemEntity;
};

export const getContainerItems = (container: Entity): ItemEntity[] => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const items = getEntitiesByType(container, ItemEntity);
  return items.filter((item) => !isPlaceholderSlot(item));
};

export const getContainerItemById = (
  container: Entity,
  itemId: string,
): ItemEntity | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const item = getEntityById(container, itemId);
  if (!item) {
    throw new Error("No item in container");
  }
  if (isPlaceholderSlot(item)) {
    return undefined;
  }

  return item as ItemEntity;
};

export const swapContainerItems = (
  container: Entity,
  sourceSlot: ContainerSlot,
  targetSlot: ContainerSlot,
): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const sourceItem = getContainerItemAt(container, sourceSlot);
  const targetItem = getContainerItemAt(container, targetSlot);
  if (!sourceItem) {
    throw new Error("No source item to swap");
  }
  if (!targetItem) {
    throw new Error("No target item to swap");
  }
  setContainerItemAt(container, targetSlot, sourceItem);
  setContainerItemAt(
    container,
    sourceSlot,
    targetItem ?? new PlaceholderEntity(),
  );
};

export const setContainerItemAt = (
  container: Entity,
  slot: ContainerSlot,
  entity: Entity,
): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  if (!container.entities[slot - 1]) {
    throw new Error(`Container slot ${slot} doesn't exist`);
  }
  container.entities[slot - 1] = entity;
};

export const setContainerItemById = (
  container: Entity,
  id: string,
  entity: Entity,
): void => {
  if (!isContainer(entity)) {
    throw new Error("Entity is not a container");
  }
  replaceEntityById(container, id, entity);
};

export const clearContainerItemAt = (
  container: Entity,
  slot: ContainerSlot,
): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  setContainerItemAt(container, slot, new PlaceholderEntity());
};

export const clearContainerItemById = (container: Entity, id: string): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  replaceEntityById(container, id, new PlaceholderEntity());
};

export const isPlaceholderSlot = (entity: Entity): boolean => {
  return hasComponentByType(entity, PlaceholderComponent);
};

export const getFirstEmptyContainerSlot = (
  container: Entity,
): ContainerSlot | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const index = container.entities.findIndex(isPlaceholderSlot);

  if (index === -1) {
    return undefined;
  }

  return (index + 1) as ContainerSlot;
};

export const getFirstContainerItem = (
  container: Entity,
): ItemEntity | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return container.entities.find((item) => !isPlaceholderSlot(item));
};

export const isContainer = (entity: Entity) => {
  return hasComponentByType(entity, ContainerComponent);
};

export const getContainerSize = (container: Entity) => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const size = getComponentByType(container, SizeComponent)?.size;
  if (size === undefined) {
    throw new Error("Not a container");
  }
  return size;
};

export const getNestDepth = (entity: Entity): number => {
  if (!isContainer(entity)) {
    return 0;
  }

  const nestedContainers = entity.entities.filter(isContainer);

  if (!nestedContainers.length) {
    return 1;
  }

  return 1 + Math.max(...nestedContainers.map(getNestDepth));
};

export const getMaxNestDepth = (entity: Entity) => {
  return (
    getComponentByType(entity, NestDepthComponent)?.nestDepth ??
    DEFAULT_NEST_DEPTH
  );
};
