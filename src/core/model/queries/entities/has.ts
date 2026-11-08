import type { Entity, EntityRoleEnum } from "../../Entity"
import { getRegistryEntityById } from "../../registry/entityRegistry"
import { resolveEntity, type EntityArgument } from "./normalize"

export const isEntity = (value: unknown): value is Entity =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof value.id === "number" &&
  getRegistryEntityById(value.id) === value

export const hasEntitiesByRole = (
  parentEntity: EntityArgument,
  entityRole: EntityRoleEnum,
): boolean => {
  if (parentEntity === undefined) {
    return false
  }

  return (
    (resolveEntity(parentEntity)?.entityByRole?.get(entityRole)?.size ?? 0) > 0
  )
}

export const hasEntity = (
  parentEntity: EntityArgument,
  childEntity: EntityArgument,
): boolean => {
  const source = resolveEntity(parentEntity)
  const child = resolveEntity(childEntity)

  if (!source || !child) {
    return false
  }

  return source?.entityById?.has(child?.id) ?? false
}
