import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/components/get";
import { ExpComponent } from "../components/mobs/ExpComponent";

export const getExp = (entity: Entity) => {
  const exp =
    getComponentByType(entity, ExpComponent)?.exp ?? ExpComponent.defaults.exp;
  return exp;
};
