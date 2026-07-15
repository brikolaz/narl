import { EntityRole, type Entity } from "../../../core/ecs/Entity";
import { upsertComponents } from "../../../core/ecs/queries/components/add";
import { getComponentByType } from "../../../core/ecs/queries/components/get";
import { removeComponentsByType } from "../../../core/ecs/queries/components/remove";
import {
  upsertRoleEntities
} from "../../../core/ecs/queries/entities/add";
import { getEntitiesByRole } from "../../../core/ecs/queries/entities/get";
import { removeEntityById } from "../../../core/ecs/queries/entities/remove";
import { detachRegistryEntity } from "../../../core/ecs/registry/entityRegistry";
import { SizeComponent } from "../../model/components/containers/SizeComponent";
import { PositionComponent } from "../../model/components/PositionComponent";
import {
  getBackpack,
  getContainerItemAt,
  getContainerItems,
  getFirstEmptyContainerSlot,
  isContainer,
} from "../../model/queries/containers";
import type { ContainerSlot } from "./types";

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
    return;
  }

  const existingItem = getContainerItemAt(container, slot);
  if (existingItem) {
    removeEntityById(existingItem.id);
  }
  detachRegistryEntity(entity.id);
  removeComponentsByType(entity, PositionComponent.type);
  upsertComponents(entity, PositionComponent({ position: slot }));
  upsertRoleEntities(container, {
    [EntityRole.ITEM]: entity,
  });
};

export const clearContainerItemAt = (
  container: Entity,
  slot: ContainerSlot,
): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const item = getContainerItems(container).find((item) => {
    return getComponentByType(item, PositionComponent)?.position === slot;
  });
  if (!item) {
    return;
  }
  removeEntityById(item.id);
};

export const clearContainerItemById = (container: Entity, id: number): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const item = getEntitiesByRole(container, EntityRole.ITEM).find(
    (item) => item.id === id,
  );
  if (!item) {
    throw new Error("Item doesn't belong to the container");
  }
  removeEntityById(id);
};

export const clearContainerItems = (container: Entity): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const items = getContainerItems(container);
  items.forEach((item) => clearContainerItemById(container, item.id));
};
