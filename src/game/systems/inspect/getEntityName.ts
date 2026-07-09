import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/components/get";
import { CURSED_PREFIX } from "../../../utils/constants";
import { NameComponent } from "../../model/components/display/NameComponent";
import { isCursed } from "../../model/queries/curse";

const getEntityNamePrefix = (entity: Entity) => {
  return isCursed(entity) ? CURSED_PREFIX : undefined;
};

export const getEntityName = (entity?: Entity) => {
  if (!entity) {
    return NameComponent.defaults.name;
  }

  const name = getComponentByType(entity, NameComponent)?.name;
  if (name === undefined) {
    return NameComponent.defaults.name;
  }

  return [getEntityNamePrefix(entity), name].filter(Boolean).join(" ");
};
