import type { Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { ExpComponent } from "../components/mobs/ExpComponent";

export const getExp = (entity: Entity) => {
  const exp =
    getComponentByType(entity, ExpComponent)?.exp ?? ExpComponent.defaults.exp;
  return exp;
};
