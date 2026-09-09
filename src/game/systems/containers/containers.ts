import { EntityRole, type Entity } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { removeComponentsByType } from "../../../core/model/queries/components/remove";
import { upsertRoleEntities } from "../../../core/model/queries/entities/add";
import {
  getEntitiesByRole,
  getEntityByRole,
} from "../../../core/model/queries/entities/get";
import type { EntityArgument } from "../../../core/model/queries/entities/normalize";
import { ContainerComponent } from "../../model/components/containers/ContainerComponent";
import { NestDepthComponent } from "../../model/components/containers/NestDepthComponent";
import {
  detachEntity,
  removeEntity,
} from "../../../core/model/queries/entities/remove";
import { SizeComponent } from "../../model/components/containers/SizeComponent";
import { PositionComponent } from "../../model/components/spatial/PositionComponent";
import { getPosition, setPosition } from "../position/position";
import { ALL_CONTAINER_SLOTS, type ContainerSlot } from "./types";

export const getBackpack = (entity: Entity): Entity | undefined => {
  return getEntityByRole(entity, EntityRole.BACKPACK);
};

export const getContainerItemAt = (
  container: Entity,
  containerSlot: ContainerSlot,
): Entity | undefined => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return getEntitiesByRole(container, EntityRole.ITEM).find((item) => {
    return getPosition(item) === containerSlot;
  });
};

export const getContainerItems = (container: Entity): Entity[] => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return getEntitiesByRole(container, EntityRole.ITEM);
};

const getContainerSize = (container: Entity) => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  return (
    getComponentByType(container, SizeComponent)?.size ??
    SizeComponent.defaults.size
  );
};

const getEmptySlots = (container: Entity): Set<ContainerSlot> => {
  const occupiedSlots = new Set(
    getContainerItems(container).map((item) => {
      const position = getPosition(item);
      if (!position) {
        throw new Error("Container item has no position component");
      }
      return position;
    }),
  );
  const containerSlots = new Set(
    [...ALL_CONTAINER_SLOTS].slice(0, getContainerSize(container)),
  );
  return containerSlots.difference(occupiedSlots);
};

const getFirstEmptyContainerSlot = (
  container: Entity,
): ContainerSlot | undefined => {
  return getEmptySlots(container).values().next().value;
};

export const getFirstContainerItem = (
  container: Entity,
): Entity | undefined => getContainerItemAt(container, 1);

export const isContainer = (entity: EntityArgument) => {
  return hasComponentsByType(entity, ContainerComponent);
};

export const isContainerFull = (container: Entity): boolean => {
  return getFirstEmptyContainerSlot(container) === undefined;
};

export const getNestDepth = (entity: Entity): number => {
  if (!isContainer(entity)) {
    return 0;
  }
  const nestedContainers = getContainerItems(entity).filter(isContainer);
  return nestedContainers.length
    ? 1 + Math.max(...nestedContainers.map(getNestDepth))
    : 1;
};

export const getMaxNestDepth = (entity: Entity) => {
  return (
    getComponentByType(entity, NestDepthComponent)?.nestDepth ??
    NestDepthComponent.defaults.nestDepth
  );
};

export const addItemToEntityBackpack = (entity: Entity, item: Entity): void => {
  const backpack = getBackpack(entity);
  if (!backpack) {
    throw new Error("No backpack");
  }
  addItemToContainer(backpack, item);
};

// TODO: rewrite to itemS
export const addItemToContainer = (
  container: Entity,
  item: Entity | undefined,
): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  if (!item) {
    return;
  }
  const slot = getFirstEmptyContainerSlot(container);

  if (!slot) {
    throw new Error("Container is full");
  }
  setContainerItemAt(container, slot, item);
};

export const setContainerItemAt = (
  container: Entity,
  slot: ContainerSlot,
  entity: Entity,
): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const size =
    getComponentByType(container, SizeComponent)?.size ??
    SizeComponent.defaults.size;
  if (slot > size) {
    throw new Error(`Container slot ${slot} exceeds size ${size}`);
  }

  const existingItem = getContainerItemAt(container, slot);
  if (existingItem) {
    removeEntity(existingItem.id);
  }
  detachEntity(entity.id);
  removeComponentsByType(entity, PositionComponent.type);
  upsertComponents(entity, PositionComponent({ position: slot }));
  upsertRoleEntities(container, {
    [EntityRole.ITEM]: entity,
  });
  setPosition(entity, slot);
};

export const clearContainerItemAt = (
  container: Entity,
  slot: ContainerSlot,
): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const item = getContainerItems(container).find((item) => {
    return getPosition(item) === slot;
  });
  if (!item) {
    return;
  }
  removeEntity(item.id);
};

export const unpackContainer = (container: Entity) => {
  const items = getContainerItems(container);
  items.forEach((item) => detachEntity(item));
  return [...items, container];
};
