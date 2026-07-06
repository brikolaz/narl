import { immerable } from "immer";
import { getId } from "../../utils/getId";
import type { Component, ComponentType } from "./Component";
import type { Id } from "./Id";

export enum EntityRole {
  DEFAULT = "DEFAULT",
  CONTAINER = "CONTAINER",
  BACKPACK = "BACKPACK",
  EQ = "EQ",
  ITEM = "ITEM",
}

export type Entity = {
  [immerable]: boolean;
  id: Id;
  componentById: Map<Id, Component>;
  componentByType: Map<ComponentType, Id[]>;
  entityById: Map<Id, Entity>;
  entityByRole: Map<EntityRole, Id[]>;
};

export const Entity = (): Entity => {
  const entity: Entity = {
    [immerable]: true,
    id: getId(),
    componentById: new Map<Id, Component>(),
    componentByType: new Map<ComponentType, Id[]>(),
    entityById: new Map<Id, Entity>(),
    entityByRole: new Map<EntityRole, Id[]>(),
  };

  return entity;
};
