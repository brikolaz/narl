import { EntityRole, type Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import {
  getEntitiesByRole,
  getEntityByRole,
} from "../../../core/model/queries/entities/get";
import type { EntityArgument } from "../../../core/model/queries/entities/normalize";
import {
  ALL_CONTAINER_SLOTS,
  type ContainerSlot,
} from "../../systems/containers/types";
import { ContainerComponent } from "../components/containers/ContainerComponent";
import { NestDepthComponent } from "../components/containers/NestDepthComponent";
import { SizeComponent } from "../components/containers/SizeComponent";
import { getPosition } from "./position";

export const getBackpack = (entity: Entity): Entity | undefined => {
  return getEntityByRole(entity, EntityRole.BACKPACK);
};

export const isContainerFull = (container: Entity): boolean => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return getFirstEmptyContainerSlot(container) === undefined;
};

export const isContainerEmpty = (container: Entity): boolean => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  for (let i = 0; i < getContainerSize(container); i++) {
    if (getContainerItemAt(container, (i + 1) as ContainerSlot)) {
      return false;
    }
  }
  return true;
};

export const getContainerItemAt = (
  container: Entity,
  containerSlot: ContainerSlot,
): Entity | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const item = getEntitiesByRole(container, EntityRole.ITEM).find((item) => {
    return getPosition(item) === containerSlot;
  });

  return item;
};

export const getContainerItems = (container: Entity): Entity[] => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return getEntitiesByRole(container, EntityRole.ITEM);
};

const getEmptySlots = (container: Entity): Set<ContainerSlot> => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const occupiedSlots = new Set(
    getEntitiesByRole(container, EntityRole.ITEM).map((item) => {
      const pos = getPosition(item);
      if (!pos) {
        throw new Error("Container item has no position component");
      }
      return pos;
    }),
  );
  const containerSlots = new Set(
    [...ALL_CONTAINER_SLOTS].slice(0, getContainerSize(container)),
  );

  return containerSlots.difference(occupiedSlots);
};

export const getFirstEmptyContainerSlot = (
  container: Entity,
): ContainerSlot | undefined => {
  const emptySlots = getEmptySlots(container);

  return emptySlots.values().next().value;
};

export const getFirstContainerItem = (
  container: Entity,
): Entity | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return getContainerItemAt(container, 1);
};

export const isContainer = (entity: EntityArgument) => {
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
