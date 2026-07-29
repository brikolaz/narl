import { STATE } from "../../game/state/state";
import { Random } from "../../game/systems/rng/random";
import type { RNG } from "../../game/systems/rng/rng";
import { DEFAULT_SEED } from "../../utils/constants";
import type { Component, ComponentType } from "./Component";
import type { Id } from "./Id";
import { getEcsNamespace, Namespace } from "./namespaces";
import { upsertRegistryEntities } from "./registry/entityRegistry";
import type { Unique } from "./Unique";

export const EntityRole = {
  DEFAULT: "DEFAULT",
  BACKPACK: "BACKPACK",
  EQ: "EQ",
  ITEM: "ITEM",
} as const;

export type EntityRole = (typeof EntityRole)[keyof typeof EntityRole];

export type EntityType = symbol;

export type Entity = {
  type: EntityType;
  rng: RNG;
  componentById: Map<Id, Component>;
  componentByType: Map<ComponentType, Map<Id, Component>>;
  entityById: Map<Id, Entity>;
  entityByRole: Map<EntityRole, Set<Entity>>;
} & Unique;

export type EntityCreator = { (): Entity; type: EntityType };

export const getEntityCreator = (type: string): EntityCreator => {
  const id = STATE.getId();
  const typeNamespace = getEcsNamespace(Namespace.ENTITY, type);
  const entityNamespace = getEcsNamespace(Namespace.ENTITY, type, id);
  const entityType: ComponentType = Symbol(typeNamespace);

  const creator: EntityCreator = () => {
    const entity = {
      id: STATE.getId(),
      type: entityType,
      rng: new Random({ namespace: entityNamespace, seed: DEFAULT_SEED }),
      componentById: new Map<Id, Component>(),
      componentByType: new Map<ComponentType, Map<Id, Component>>(),
      entityById: new Map<Id, Entity>(),
      entityByRole: new Map<EntityRole, Set<Entity>>(),
    };
    upsertRegistryEntities(entity);
    return entity;
  };
  creator.type = entityType;

  return creator;
};
