import type { Entity } from "../../../core/ecs/Entity";
import {
  getComponentByType,
  hasComponentByType,
} from "../../../core/ecs/queries/component";
import {
  getEntitiesByType,
  getEntityById,
  getEntityByType,
} from "../../../core/ecs/queries/entities";
import { ContainerComponent } from "../components/containers/ContainerComponent";
import { NestDepthComponent } from "../components/containers/NestDepthComponent";
import { PlaceholderComponent } from "../components/containers/PlaceholderComponent";
import { SizeComponent } from "../components/containers/SizeComponent";
import { BackpackEntity } from "../entities/items/BackpackEntity";
import { ItemEntity } from "../entities/items/ItemEntity";
import type { ContainerSlot } from "../../systems/inv/containers";

export const getBackpack = (entity: Entity): BackpackEntity | undefined => {
  return getEntityByType(entity, BackpackEntity);
};

export const isContainerFull = (container: Entity): boolean => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return getFirstEmptyContainerSlot(container) === undefined;
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
    NestDepthComponent.DEFAULT_NEST_DEPTH
  );
};
