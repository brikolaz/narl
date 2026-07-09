import { immerable } from "immer";
import { getId } from "../../utils/getId";
import type { Component, ComponentType } from "./Component";
import type { Id } from "./Id";
import { getEcsNamespace, Namespace } from "./namespaces";

export enum EntityRole {
  DEFAULT = "DEFAULT",
  CONTAINER = "CONTAINER",
  BACKPACK = "BACKPACK",
  EQ = "EQ",
  ITEM = "ITEM",
}

export type EntityType = symbol;

export type Entity = {
  [immerable]: boolean;
  id: Id;
  type: EntityType;
  componentById: Map<Id, Component>;
  componentByType: Map<ComponentType, Id[]>;
  entityById: Map<Id, Entity>;
  entityByRole: Map<EntityRole, Id[]>;
};

export type EntityCreator = { (): Entity; type: EntityType };

export const getEntityCreator = (type: string): EntityCreator => {
  const entityType: ComponentType = Symbol(
    getEcsNamespace(Namespace.ENTITY, type),
  );

  const creator: EntityCreator = () => ({
    [immerable]: true,
    id: getId(),
    componentById: new Map<Id, Component>(),
    componentByType: new Map<ComponentType, Id[]>(),
    entityById: new Map<Id, Entity>(),
    entityByRole: new Map<EntityRole, Id[]>(),
    type: entityType,
  });
  creator.type = entityType;

  return creator;
};
