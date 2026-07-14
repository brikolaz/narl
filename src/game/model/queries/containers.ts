import { EntityRole, type Entity } from "../../../core/ecs/Entity";
import type { Id } from "../../../core/ecs/Id";
import { getComponentByType } from "../../../core/ecs/queries/components/get";
import { hasComponentsByType } from "../../../core/ecs/queries/components/has";
import {
  getEntitiesByRole,
  getEntityById,
  getEntityByRole,
} from "../../../core/ecs/queries/entities/get";
import type { ContainerSlot } from "../../systems/inv/containers";
import { ContainerComponent } from "../components/containers/ContainerComponent";
import { NestDepthComponent } from "../components/containers/NestDepthComponent";
import { PlaceholderComponent } from "../components/containers/PlaceholderComponent";
import { SizeComponent } from "../components/containers/SizeComponent";

export const getBackpack = (entity: Entity): Entity | undefined => {
  return getEntityByRole(entity, EntityRole.BACKPACK);
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
): Entity | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const item = getEntitiesByRole(container, EntityRole.ITEM)[containerSlot - 1];
  if (!item) {
    throw new Error(`No container item at slot ${containerSlot}`);
  }
  if (isPlaceholderSlot(item)) {
    return undefined;
  }

  return item;
};

export const getContainerItems = (container: Entity): Entity[] => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const items = getEntitiesByRole(container, EntityRole.ITEM);
  return items.filter((item) => !isPlaceholderSlot(item));
};

export const getContainerItemById = (
  container: Entity,
  itemId: Id,
): Entity | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const item = getEntityById(itemId);
  if (!item) {
    throw new Error("No item in container");
  }
  if (isPlaceholderSlot(item)) {
    return undefined;
  }

  return item;
};

export const isPlaceholderSlot = (entity: Entity): boolean => {
  return hasComponentsByType(entity, PlaceholderComponent);
};

export const getFirstEmptyContainerSlot = (
  container: Entity,
): ContainerSlot | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const index = getEntitiesByRole(container, EntityRole.ITEM).findIndex(
    isPlaceholderSlot,
  );
  
  if (index === -1) {
    return undefined;
  }

  return index + 1;
};

export const getFirstContainerItem = (
  container: Entity,
): Entity | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return getContainerItems(container).find((item) => !isPlaceholderSlot(item));
};

export const isContainer = (entity: Entity) => {
  return hasComponentsByType(entity, ContainerComponent);
};

export const getContainerSize = (container: Entity) => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }

  return (
    getComponentByType(container, SizeComponent)?.size ??
    SizeComponent.defaults.size
  );
};

export const getNestDepth = (entity: Entity): number => {
  if (!isContainer(entity)) {
    return 0;
  }

  const nestedContainers = getContainerItems(entity).filter(isContainer);

  if (!nestedContainers.length) {
    return 1;
  }

  return 1 + Math.max(...nestedContainers.map(getNestDepth));
};

export const getMaxNestDepth = (entity: Entity) => {
  return (
    getComponentByType(entity, NestDepthComponent)?.nestDepth ??
    NestDepthComponent.defaults.nestDepth
  );
};
