import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { CURSED_PREFIX } from "../../../utils";
import { NameComponent } from "../../model/components/display/NameComponent";
import { isCursed } from "../../model/queries/curse";

const getEntityNamePrefix = (entity: Entity) => {
  return isCursed(entity) ? CURSED_PREFIX : undefined;
};

export const getEntityName = (entity?: Entity) => {
  if (!entity) {
    return NameComponent.DEFAULT_NAME;
  }

  const name = getComponentByType(entity, NameComponent)?.name;
  if (name === undefined) {
    return NameComponent.DEFAULT_NAME;
  }

  return [getEntityNamePrefix(entity), name].filter(Boolean).join(" ");
};
