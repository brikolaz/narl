import { EntityRole, type Entity } from "../../../core/ecs/Entity";
import { getEntitiesByRole } from "../../../core/ecs/queries/entities/get";
import { replaceEntityById } from "../../../core/ecs/queries/entities/patch";
import { PlaceholderEntityFactory } from "../../model/entities/items/PlaceholderItemEntity";
import {
  getBackpack,
  getContainerItemAt,
  getContainerItems,
  getFirstEmptyContainerSlot,
  isContainer,
} from "../../model/queries/containers";

export type ContainerSlot = number;

export const addItemToEntityBackpack = (entity: Entity, item: Entity): void => {
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
    targetItem ?? PlaceholderEntityFactory.getDefault(),
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
  const nextItems = getEntitiesByRole(container, EntityRole.ITEM);
  if (!nextItems[slot - 1]) {
    throw new Error(`Container slot ${slot} doesn't exist`);
  }
  const previousItem = nextItems[slot - 1];
  replaceEntityById(previousItem.id, entity);
};

export const clearContainerItemAt = (
  container: Entity,
  slot: ContainerSlot,
): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  setContainerItemAt(container, slot, PlaceholderEntityFactory.getDefault());
};

export const clearContainerItemById = (container: Entity, id: number): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const slot =
    getEntitiesByRole(container, EntityRole.ITEM).findIndex(
      (item) => item.id === id,
    ) + 1;
  if (slot === 0) {
    return;
  }
  clearContainerItemAt(container, slot);
};

export const clearContainerItems = (container: Entity): void => {
  if (!isContainer(container)) {
    throw new Error("Entity is not a container");
  }
  const items = getContainerItems(container);
  items.forEach((item) => clearContainerItemById(container, item.id));
};
