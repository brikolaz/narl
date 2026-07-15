import type { Component } from "../../Component";
import type { Entity } from "../../Entity";
import type { Id } from "../../Id";
import { upsertComponentRegistryRecords } from "../../registry/componentRegistry";
import { getEntityById } from "../entities/get";

const upsertDataComponents = (
  entity: Entity | undefined,
  ...components: Component[]
): void => {
  if (!entity) {
    return;
  }

  for (const component of components) {
    entity.componentById.set(component.id, component);
    entity.componentByType.set(
      component.type,
      (entity.componentByType.get(component.type) ?? new Map()).set(
        component.id,
        component,
      ),
    );
  }
};

export const upsertComponents = (
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

  upsertDataComponents(source, ...components);

  upsertComponentRegistryRecords(
    ...components.map((component) => ({
      component,
      parent: source,
    })),
  );
};
