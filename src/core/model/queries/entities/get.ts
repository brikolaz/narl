import type { Entity, EntityRoleEnum } from "../../Entity"
import type { Id } from "../../Id"
import { getRegistryEntityById } from "../../registry/entityRegistry"
import { resolveEntity, type EntityArgument } from "./normalize"

export const getEntityById = (id: Id) => {
  return getRegistryEntityById(id)
}

export const getEntitiesByRole = (
  parentEntity: EntityArgument,
  entityRole: EntityRoleEnum,
): Entity[] => {
  if (parentEntity === undefined) {
    return []
  }
  const source = resolveEntity(parentEntity)
  const entities = [...(source?.entityByRole.get(entityRole) ?? [])]
  return entities.filter(
    (targetEntity): targetEntity is Entity => targetEntity !== undefined,
  )
}

export const getEntityByRole = (
  parentEntity: EntityArgument,
  entityRole: EntityRoleEnum,
): Entity | undefined => {
  return getEntitiesByRole(parentEntity, entityRole)[0]
}
