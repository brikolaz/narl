
import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { HpComponent } from "../../model/components/mobs/HpComponent";

export const getHp = (entity: Entity): HpComponent => {
  const hpComponent = getComponentByType(entity, HpComponent);

  if (!hpComponent) {
    throw new Error(`Entity does not have an HpComponent`);
  }

  return hpComponent;
};
