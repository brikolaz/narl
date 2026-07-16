import { EntityRole, type Entity } from "../../Entity";
import type { Id } from "../../Id";
import { getEntityById } from "./get";

export type ChildrenInput =
  | (Entity | undefined)[]
  | Partial<Record<EntityRole, (Entity | undefined)[] | Entity>>;

export type EntityArgument = Entity | Id | undefined;

export const normalizeChildrenEntityRecords = (
  children: ChildrenInput,
): Partial<Record<EntityRole, Entity[]>> => {
  if (Array.isArray(children)) {
    return {
      [EntityRole.DEFAULT]: children.filter(
        (child): child is Entity => child !== undefined,
      ),
    };
  }

  const normalized: Partial<Record<EntityRole, Entity[]>> = {};

  for (const [role, entities] of Object.entries(children)) {
    normalized[role as EntityRole] = [entities]
      .flat()
      .filter((child): child is Entity => child !== undefined);
  }

  return normalized;
};

export const resolveEntity = (
  entity: EntityArgument,
): Entity | undefined => {
  if (entity === undefined) {
    return undefined;
  }

  return typeof entity === "number" ? getEntityById(entity) : entity;
};
