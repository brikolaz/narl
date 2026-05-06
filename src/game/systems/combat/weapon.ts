import { Entity, hasComponentByType } from "../../../core/ecs";
import { DmgComponent } from "../../model/components/DmgComponent";

export const isWeapon = (item: Entity) => {
  return hasComponentByType(item, DmgComponent);
};
