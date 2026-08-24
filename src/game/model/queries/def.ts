import type { Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { DefComponent } from "../components/items/DefComponent";

export const getDef = (entity?: Entity): number => {
  return getComponentByType(entity, DefComponent)?.def ?? DefComponent.defaults.def;
};
