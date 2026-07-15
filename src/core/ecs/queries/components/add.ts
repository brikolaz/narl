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
    const nextComponents = entity.componentByType.get(component.type) ?? [];
    nextComponents.push(component);
    entity.componentByType.set(component.type, nextComponents);
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
      parent: source,
    })),
  );
};

const upsertDataComponents = (
  entity: Entity,
  ...components: Component[]
): void => {
  for (const component of components) {
    const nextComponents = entity.componentByType.get(component.type) ?? [];
    const ids = nextComponents.map((c) => c.id);
    if (!ids.includes(component.id)) {
      nextComponents.push(component);
    }

    entity.componentByType.set(component.type, nextComponents);
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
      parent: source,
    })),
  );

  removeComponentsByType(
    source,
    ...components.map((component) => component.type),
  );
  addComponents(entity, ...components);
};
