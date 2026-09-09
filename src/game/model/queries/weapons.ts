import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { DmgComponent } from "../components/combat/DmgComponent";

export const isWeapon = (item: Entity) => {
  return hasComponentsByType(item, DmgComponent);
};
