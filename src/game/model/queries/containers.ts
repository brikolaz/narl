import { EntityRole, type Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/components/get";
import { hasComponentsByType } from "../../../core/ecs/queries/components/has";
import {
  getEntitiesByRole,
  getEntityByRole,
} from "../../../core/ecs/queries/entities/get";
import {
  ALL_CONTAINER_SLOTS,
  type ContainerSlot,
} from "../../systems/containers/types";
import { ContainerComponent } from "../components/containers/ContainerComponent";
import { NestDepthComponent } from "../components/containers/NestDepthComponent";
import { SizeComponent } from "../components/containers/SizeComponent";
import { PositionComponent } from "../components/PositionComponent";

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
  const item = getEntitiesByRole(container, EntityRole.ITEM).find((item) => {
    const position = getComponentByType(item, PositionComponent)?.position;
    return position === containerSlot;
  });

  return item;
};

export const getContainerItems = (container: Entity): Entity[] => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return getEntitiesByRole(container, EntityRole.ITEM);
};

const getEmptySlots = (container: Entity): ContainerSlot[] => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const occupiedSlots = new Set(
    getEntitiesByRole(container, EntityRole.ITEM).map((item) => {
      const pos = getComponentByType(item, PositionComponent)?.position;
      if (!pos) {
        throw new Error("Container item has no position component");
      }
      return pos;
    }),
  );
  return [...ALL_CONTAINER_SLOTS.difference(occupiedSlots)];
};

export const getFirstEmptyContainerSlot = (
  container: Entity,
): ContainerSlot | undefined => {
  const emptySlots = getEmptySlots(container);

  return emptySlots.at(0);
};

export const getFirstContainerItem = (
  container: Entity,
): Entity | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return getContainerItemAt(container, 1);
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
