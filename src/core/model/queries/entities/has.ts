import type { EntityRole } from "../../Entity";
import { resolveEntity, type EntityArgument } from "./normalize";

export const hasEntitiesByRole = (
  parentEntity: EntityArgument,
  entityRole: EntityRole,
): boolean => {
  if (parentEntity === undefined) return false;

  return (
    (resolveEntity(parentEntity)?.entityByRole?.get(entityRole)?.size ?? 0) >
    0
  );
};

export const hasEntity = (
  parentEntity: EntityArgument,
  childEntity: EntityArgument,
): boolean => {
  const source = resolveEntity(parentEntity);
  const child = resolveEntity(childEntity);

  if (!source || !child) return false;

  return source?.entityById?.has(child?.id) ?? false;
};
