import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { DmgComponent } from "../../model/components/combat/DmgComponent";
import { MainHandSlotComponent } from "../../model/components/equipment/slots/MainHandSlotComponent";
import { getManual } from "../../model/entities/getManual";
import { getContainerItemAt } from "../containers/containers";
import { getEqSlotByType } from "../eq/eq";

export const getAttackWeapon = (entity: Entity): Entity | undefined => {
  const manual = getManual(entity);
  if (manual?.getAttackWeapon) {
    return manual.getAttackWeapon(entity);
  }
  const slot = getEqSlotByType(entity, MainHandSlotComponent);
  return slot ? getContainerItemAt(slot, 1) : undefined;
};

export const isWeapon = (item: Entity) => {
  return hasComponentsByType(item, DmgComponent);
};
