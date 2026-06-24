import type { Entity } from "../../../core/ecs/Entity";
import { hasComponentByType } from "../../../core/ecs/queries/component";
import { DmgComponent } from "../../model/components/items/DmgComponent";

export const isWeapon = (item: Entity) => {
  return hasComponentByType(item, DmgComponent);
};
