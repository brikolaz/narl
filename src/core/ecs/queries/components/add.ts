import type { Component } from "../../Component";
import type { Entity } from "../../Entity";
import type { Id } from "../../Id";
import { upsertComponentRegistryRecords } from "../../registry/componentRegistry";
import { getEntityById } from "../entities/get";
import { removeComponentsByType } from "./remove";

const addDataComponents = (
  entity: Entity | undefined,
  ...components: Component[]
): void => {
  if (!entity) {
    return;
  }
  for (const component of components) {
    const ids = entity.componentByType.get(component.type) ?? [];
    ids.push(component.id);
    entity.componentByType.set(component.type, ids);
    entity.componentById.set(component.id, component);
  }
};

export const addComponents = (
  entity: Entity | Id | undefined,
  ...components: Component[]
): void => {
  if (entity === undefined) {
    return;
  }
  const source = typeof entity === "number" ? getEntityById(entity) : entity;
  if (!source) {
    return;
  }
  addDataComponents(source, ...components);
  upsertComponentRegistryRecords(
    ...components.map((component) => ({
      component,
      parent: source.id,
    })),
  );
};

const upsertDataComponents = (
  entity: Entity,
  ...components: Component[]
): void => {
  for (const component of components) {
    const ids = entity.componentByType.get(component.type) ?? [];

    if (!ids.includes(component.id)) {
      ids.push(component.id);
    }

    entity.componentByType.set(component.type, ids);
    entity.componentById.set(component.id, component);
  }
};

export const upsertComponents = (
  entity: Entity | Id | undefined,
  ...components: Component[]
): void => {
  if (!entity || components.length === 0) {
    return;
  }

  const source = typeof entity === "number" ? getEntityById(entity) : entity;

  if (!source) {
    return;
  }

  upsertDataComponents(source, ...components);
  upsertComponentRegistryRecords(
    ...components.map((component) => ({
      component,
      parent: source.id,
    })),
  );

  removeComponentsByType(
    source,
    ...components.map((component) => component.type),
  );
  addComponents(entity, ...components);
};
