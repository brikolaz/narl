import type { Component } from "../../Component";
import type { Entity } from "../../Entity";
import { upsertComponentRegistryRecords } from "../../registry/componentRegistry";
import { resolveEntity, type EntityArgument } from "../entities/normalize";

const upsertDataComponents = (
  entity: Entity,
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
  entity: EntityArgument,
  ...components: Component[]
): void => {
  if (entity === undefined) {
    return;
  }
  const source = resolveEntity(entity);
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
