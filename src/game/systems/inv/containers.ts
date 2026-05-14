import type { Entity } from "../../../core/ecs/Entity";
import {
  getComponentByType,
  hasComponentByType,
} from "../../../core/ecs/queries/component";
import {
  addEntity,
  getEntitiesByType,
  getEntityByType,
  patchEntityById,
} from "../../../core/ecs/queries/entities";
import { DEFAULT_NEST_DEPTH } from "../../../utils";
import { ContainerComponent } from "../../model/components/ContainerComponent";
import { NestDepthComponent } from "../../model/components/NestDepthComponent";
import { SizeComponent } from "../../model/components/SizeComponent";
import { BackpackEntity } from "../../model/entities/items/BackpackEntity";
import { ItemEntity } from "../../model/entities/items/ItemEntity";
import type { InvSlot } from "./types";

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
  return getComponentByType(entity, NestDepthComponent)?.nestDepth ?? DEFAULT_NEST_DEPTH;
};
