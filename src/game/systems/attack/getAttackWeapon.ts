import type { Entity } from "../../../core/model/Entity";
import { MainHandSlotComponent } from "../../model/components/eq/slots/MainHandSlotComponent";
import { getManual } from "../../model/entities/getManual";
import { getContainerItemAt } from "../../model/queries/containers";
import { getEqSlotByType } from "../../model/queries/eq";

export const getAttackWeapon = (entity: Entity): Entity | undefined => {
  const manual = getManual(entity);
  if (manual?.getAttackWeapon) {
    return manual.getAttackWeapon(entity);
  }
  const slot = getEqSlotByType(entity, MainHandSlotComponent);
  return getContainerItemAt(slot, 1);
};
