import type { Component } from "../../Component";
import type { Entity } from "../../Entity";
import type { Id } from "../../Id";
import { upsertComponentRegistryRecords } from "../../registry/componentRegistry";
import { getEntityById } from "../entities";

// TODO: maybe splitit responsibilities
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
  const source = typeof entity === "string" ? getEntityById(entity) : entity;
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
