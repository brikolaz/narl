import { EntityRole, type Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import {
  resolveComponentType
} from "../../../core/model/queries/components/normalize";
import { upsertRoleEntities } from "../../../core/model/queries/entities/add";
import { getEntitiesByRole } from "../../../core/model/queries/entities/get";
import {
  getEntityRegistryRecordById
} from "../../../core/model/registry/entityRegistry";
import type { EqSlotComponent } from "../../systems/eq/eq";
import { EQ_SLOT_COMPONENTS } from "../entities/eq/eq";
import { ArmorSlotEntityFactory } from "../entities/eq/slots/ArmorSlotEntity";
import { BootsSlotEntityFactory } from "../entities/eq/slots/BootsSlotEntity";
import { HeadSlotEntityFactory } from "../entities/eq/slots/HeadSlotEntity";
import { MainHandSlotEntityFactory } from "../entities/eq/slots/MainHandSlotEntity";
import { OffhandSlotEntityFactory } from "../entities/eq/slots/OffhandSlotEntity";
import { PantsSlotEntityFactory } from "../entities/eq/slots/pantsSlot/PantsSlotEntity";
import { getContainerItems } from "./containers";
import { getPosition } from "./position";

export const getEq = (entity: Entity): Entity[] => {
  return [...getEntitiesByRole(entity, EntityRole.EQ)].sort(
    (a, b) => getPosition(a) - getPosition(b),
  );
};

export const getEqSlotsByType = (
  entity: Entity,
  componentType: EqSlotComponent,
) => {
  if (!isEqSlot(componentType)) {
    throw new Error("Not an EQ component");
  }
  const eq = getEq(entity);
  return eq.filter((eqSlot) => hasComponentsByType(eqSlot, componentType));
};

export const getEqSlotByType = (
  entity: Entity,
  componentType: EqSlotComponent,
) => {
  return getEqSlotsByType(entity, componentType)[0];
};

export const isEqSlot = (component: EqSlotComponent) => {
  const target = resolveComponentType(component);
  return EQ_SLOT_COMPONENTS.has(target);
};

export const initEq = (entity: Entity) => {
  upsertRoleEntities(entity, {
    [EntityRole.EQ]: [
      HeadSlotEntityFactory.getDefault(),
      MainHandSlotEntityFactory.getDefault(),
      ArmorSlotEntityFactory.getDefault(),
      OffhandSlotEntityFactory.getDefault(),
      PantsSlotEntityFactory.getDefault(),
      BootsSlotEntityFactory.getDefault(),
    ],
  });
};

export const getEqItems = (entity: Entity) => {
  const eq = getEq(entity);
  const items = eq.flatMap((item) => getContainerItems(item));
  return items;
};

export const getEqSlotByPosition = (entity: Entity, position: number) => {
  const eq = getEq(entity);
  return eq.find((slot) => getPosition(slot) === position);
};

export const getEqItemSlot = (entity: Entity) => {
  const parent = getEntityRegistryRecordById(entity.id)?.parent ?? undefined;
  return parent
};
