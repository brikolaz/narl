import { getComponentByType } from "../../../core/model/queries/components/get";
import type { EntityArgument } from "../../../core/model/queries/entities/normalize";
import { CURSED_PREFIX } from "../../../utils/constants";
import { NameComponent } from "../../model/components/display/NameComponent";
import { isCursed } from "../../model/queries/curse";

const getEntityNamePrefix = (entity: EntityArgument) => {
  return isCursed(entity) ? CURSED_PREFIX : undefined;
};

export const getEntityName = (entity?: EntityArgument) => {
  if (!entity) {
    return NameComponent.defaults.name;
  }
  
  const name = getComponentByType(entity, NameComponent)?.name;
  if (name === undefined) {
    return NameComponent.defaults.name;
  }

  return [getEntityNamePrefix(entity), name].filter(Boolean).join(" ");
};
