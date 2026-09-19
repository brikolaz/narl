import { STATE } from "../../game/state/state"
import { Random } from "../../game/systems/rng/random"
import type { Rng } from "../../game/systems/rng/rng"
import type { Component, ComponentType } from "./Component"
import type { Id } from "./Id"
import { getEcsNamespace, NamespaceEnum } from "./namespaces"
import { upsertRegistryEntities } from "./registry/entityRegistry"
import type { Unique } from "./Unique"
import { createEnum, type EnumType } from "../../utils/types/Enum"

export const EntityRoleEnum = createEnum(
  "DEFAULT",
  "BACKPACK",
  "EQ",
  "ITEM",
  "BONUS_STATS",
)
export type EntityRoleEnum = EnumType<typeof EntityRoleEnum>

declare const entityTypeBrand: unique symbol

export type EntityType<Type extends string = never> = [Type] extends [never]
  ? symbol
  : symbol & { readonly [entityTypeBrand]: Type }

export type Entity = {
  type: EntityType
  rng: Rng
  componentById: Map<Id, Component>
  componentByType: Map<ComponentType, Map<Id, Component>>
  entityById: Map<Id, Entity>
  entityByRole: Map<EntityRoleEnum, Set<Entity>>
} & Unique

export type EntityCreator<Type extends string = string> = {
  (): Entity
  type: EntityType<Type>
}

export const getEntityCreator = <const Type extends string>(
  type: Type,
): EntityCreator<Type> => {
  const typeNamespace = getEcsNamespace(NamespaceEnum.ENTITY, type)
  const entityType = Symbol(typeNamespace) as EntityType<Type>

  const creator: EntityCreator<Type> = () => {
    const id = STATE.getId()
    const entityNamespace = getEcsNamespace(NamespaceEnum.ENTITY, type, id)

    const entity = {
      id,
      type: entityType,
      rng: new Random({ namespace: entityNamespace, seed: STATE.seed }),
      componentById: new Map<Id, Component>(),
      componentByType: new Map<ComponentType, Map<Id, Component>>(),
      entityById: new Map<Id, Entity>(),
      entityByRole: new Map<EntityRoleEnum, Set<Entity>>(),
    }
    upsertRegistryEntities(entity)
    return entity
  }
  creator.type = entityType

  return creator
}
