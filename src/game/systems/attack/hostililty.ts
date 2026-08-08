import type { Entity } from "../../../core/model/Entity";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { HostileComponent } from "../../model/components/mobs/HostileComponent";
import { PeacefulComponent } from "../../model/components/mobs/PeacefulComponent";

export const isPeaceful = (entity: Entity) => {
  return hasComponentsByType(entity, PeacefulComponent);
};

export const isHostile = (entity?: Entity) => {
  return hasComponentsByType(entity, HostileComponent) ?? false;
};
