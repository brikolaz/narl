import type { Entity, EntityRole } from "../../Entity";
import type { Id } from "../../Id";
import { getEntityById } from "../entities/get";

export const hasEntitiesByRole = (
  entity: Entity | Id | undefined,
  entityRole: EntityRole,
): boolean => {
  if (entity === undefined) return false;
  const source = typeof entity === "number" ? getEntityById(entity) : entity;

  return (source?.entityByRole?.get(entityRole)?.size ?? 0) > 0;
};

export const hasEntityById = (
  entity: Entity | Id | undefined,
  id: Id,
): boolean => {
  if (!entity) return false;

  const source = typeof entity === "number" ? getEntityById(entity) : entity;

  return source?.entityById?.has(id) ?? false;
};
