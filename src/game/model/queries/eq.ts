import { EntityRole, type Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import {
  resolveComponentType,
  type ComponentTypeArgument,
} from "../../../core/model/queries/components/normalize";
import { upsertRoleEntities } from "../../../core/model/queries/entities/add";
import { getEntitiesByRole } from "../../../core/model/queries/entities/get";
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
  componentType: ComponentTypeArgument,
) => {
  if (!isEqSlot(componentType)) {
    throw new Error("Not an EQ component");
  }
  const eq = getEq(entity);
  return eq.filter((eqSlot) => hasComponentsByType(eqSlot, componentType));
};

export const getEqSlotByType = (
  entity: Entity,
  componentType: ComponentTypeArgument,
) => {
  return getEqSlotsByType(entity, componentType)[0];
};

export const isEqSlot = (component: ComponentTypeArgument) => {
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
