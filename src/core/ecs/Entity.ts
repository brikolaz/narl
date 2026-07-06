import { immerable } from "immer";
import { getId } from "../../utils/getId";
import type { Component, ComponentType } from "./Component";
import type { ConcreteConstructor } from "./Constructor";
import type { Id } from "./Id";
import type { Unique } from "./Unique";

export type EntityClass = ConcreteConstructor<Entity>;
export type EntityProps = Partial<{
  components: Component[];
  entities: Entity[];
}>;
export enum EntityRole {
  DEFAULT = "DEFAULT",
  CONTAINER = "CONTAINER",
  BACKPACK = "BACKPACK",
  EQ = "EQ",
}

export class Entity implements Unique {
  [immerable] = true;
  id: Id = "";
  componentById = new Map<Id, Component>();
  componentByType = new Map<ComponentType, Id[]>();
  entityById = new Map<Id, Entity>();
  entityByRole = new Map<EntityRole, Id[]>();

  constructor() {
    this.id = getId();
  }
}

export const createEntity = () => {
  const entity = new Entity();

  return entity;
};
