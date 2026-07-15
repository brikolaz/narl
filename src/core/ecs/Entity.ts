import { getId } from "../../utils/getId";
import type { Component, ComponentType } from "./Component";
import type { Id } from "./Id";
import { getEcsNamespace, Namespace } from "./namespaces";
import { upsertRegistryEntities } from "./registry/entityRegistry";

export enum EntityRole {
  DEFAULT = "DEFAULT",
  CONTAINER = "CONTAINER",
  BACKPACK = "BACKPACK",
  EQ = "EQ",
  ITEM = "ITEM",
}

export type EntityType = symbol;

export type Entity = {
  id: Id;
  type: EntityType;
  componentById: Map<Id, Component>;
  componentByType: Map<ComponentType, Map<Id, Component>>;
  entityById: Map<Id, Entity>;
  entityByRole: Map<EntityRole, Set<Entity>>;
};

export type EntityCreator = { (): Entity; type: EntityType };

export const getEntityCreator = (type: string): EntityCreator => {
  const entityType: ComponentType = Symbol(
    getEcsNamespace(Namespace.ENTITY, type),
  );

  const creator: EntityCreator = () => {
    const entity = {
      id: getId(),
      componentById: new Map<Id, Component>(),
      componentByType: new Map<ComponentType, Map<Id, Component>>(),
      entityById: new Map<Id, Entity>(),
      entityByRole: new Map<EntityRole, Set<Entity>>(),
      type: entityType,
    };
    upsertRegistryEntities(entity);
    return entity;
  };
  creator.type = entityType;

  return creator;
};
