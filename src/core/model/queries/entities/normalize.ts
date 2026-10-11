import { typedEntries } from "../../../../utils/typedEntries"
import { EntityRoleEnum, type Entity, type EntityType } from "../../Entity"
import type { Id } from "../../Id"
import { getEntityById } from "./get"

export type ChildrenInput =
  | (Entity | undefined)[]
  | Partial<Record<EntityRoleEnum, (Entity | undefined)[] | Entity>>

export type EntityArgument = Entity | Id | undefined

export type EntityTypeArgument<Type extends EntityType = EntityType> =
  Type | { readonly type: Type }

export const resolveEntityType = <Type extends EntityType>(
  entityType: EntityTypeArgument<Type>,
): Type => {
  return typeof entityType === "symbol" ? entityType : entityType.type
}

export const normalizeChildrenEntityRecords = (
  children: ChildrenInput,
): Partial<Record<EntityRoleEnum, Entity[]>> => {
  if (Array.isArray(children)) {
    return {
      [EntityRoleEnum.DEFAULT]: children.filter(
        (child): child is Entity => child !== undefined,
      ),
    }
  }

  const normalized: Partial<Record<EntityRoleEnum, Entity[]>> = {}

  for (const [role, entities] of typedEntries(children)) {
    normalized[role] = [entities]
      .flat()
      .filter((child): child is Entity => child !== undefined)
  }

  return normalized
}

export const resolveEntity = (entity: EntityArgument): Entity | undefined => {
  if (entity === undefined) {
    return undefined
  }

  return typeof entity === "number" ? getEntityById(entity) : entity
}
