import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { HostileComponent } from "../../model/components/mobs/HostileComponent";

export const isHostile = (entity?: Entity) => {
  return hasComponentsByType(entity, HostileComponent) ?? false;
};
