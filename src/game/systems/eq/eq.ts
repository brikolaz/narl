import type { Component } from "../../../core/model/Component"
import { EntityRoleEnum, type Entity } from "../../../core/model/Entity"
import { getComponentsByTypes } from "../../../core/model/queries/components/get"
import { hasComponentsByType } from "../../../core/model/queries/components/has"
import {
  resolveComponentType,
  type ComponentTypeArgument,
} from "../../../core/model/queries/components/normalize"
import { upsertRoleEntities } from "../../../core/model/queries/entities/add"
import { getEntitiesByRole } from "../../../core/model/queries/entities/get"
import { BootsComponent } from "../../model/components/equipment/BootsComponent"
import { ChestComponent } from "../../model/components/equipment/ChestComponent"
import { HeadComponent } from "../../model/components/equipment/HeadComponent"
import { MainHandComponent } from "../../model/components/equipment/MainHandComponent"
import { OffhandComponent } from "../../model/components/equipment/OffhandComponent"
import { PantsComponent } from "../../model/components/equipment/PantsComponent"
import { RemovableComponent } from "../../model/components/equipment/RemovableComponent"
import { EQ_SLOT_COMPONENTS } from "../../model/entities/eq/eq"
import { BootsSlotEntityFactory } from "../../model/entities/eq/slots/bootsSlot/factory"
import { ChestSlotEntityFactory } from "../../model/entities/eq/slots/chestSlot/factory"
import { HeadSlotEntityFactory } from "../../model/entities/eq/slots/headSlot/factory"
import { MainHandSlotEntityFactory } from "../../model/entities/eq/slots/mainHandSlot/factory"
import { OffhandSlotEntityFactory } from "../../model/entities/eq/slots/offhandSlot/factory"
import { PantsSlotEntityFactory } from "../../model/entities/eq/slots/pantsSlot/factory"
import { getContainerItems } from "../containers/containers"
import { getPosition } from "../position/position"

export type EqSlot = number
export type EqSlotComponent = ComponentTypeArgument

export const getEq = (entity: Entity): Entity[] => {
  return [...getEntitiesByRole(entity, EntityRoleEnum.EQ)].sort(
    (a, b) => getPosition(a) - getPosition(b),
  )
}

const isEqSlot = (component: EqSlotComponent) => {
  return EQ_SLOT_COMPONENTS.has(resolveComponentType(component))
}

const getEqSlotsByType = (entity: Entity, componentType: EqSlotComponent) => {
  if (!isEqSlot(componentType)) {
    throw new Error("Not an EQ component")
  }
  return getEq(entity).filter((slot) =>
    hasComponentsByType(slot, componentType),
  )
}

export const getEqSlotByType = (
  entity: Entity,
  componentType: EqSlotComponent,
) => getEqSlotsByType(entity, componentType)[0]

export const initEq = (entity: Entity) => {
  upsertRoleEntities(entity, {
    [EntityRoleEnum.EQ]: [
      HeadSlotEntityFactory.getDefault(),
      MainHandSlotEntityFactory.getDefault(),
      ChestSlotEntityFactory.getDefault(),
      OffhandSlotEntityFactory.getDefault(),
      PantsSlotEntityFactory.getDefault(),
      BootsSlotEntityFactory.getDefault(),
    ],
  })
}

export const getEqItems = (entity: Entity) => {
  return getEq(entity).flatMap((item) => getContainerItems(item))
}

export const getEqSlotByPosition = (entity: Entity, position: number) => {
  return getEq(entity).find((slot) => getPosition(slot) === position)
}

export const getItemSlots = (entity: Entity): Component[] => {
  return getComponentsByTypes(entity, [
    ChestComponent,
    HeadComponent,
    MainHandComponent,
    OffhandComponent,
    PantsComponent,
    BootsComponent,
  ])
}

export const isRemovable = (entity: Entity): boolean => {
  return hasComponentsByType(entity, RemovableComponent)
}
