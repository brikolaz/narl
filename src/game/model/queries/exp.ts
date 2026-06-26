import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { ExpComponent } from "../components/mobs/ExpComponent";

export const getExp = (entity: Entity) => {
  const exp =
    getComponentByType(entity, ExpComponent)?.exp ?? ExpComponent.DEFAULT_EXP;
  return exp;
};
