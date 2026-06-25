import type { Entity } from "../../../core/ecs/Entity";
import { hasComponentByType } from "../../../core/ecs/queries/component";
import { HostileComponent } from "../../model/components/mobs/HostileComponent";
import { PeacefulComponent } from "../../model/components/mobs/PeacefulComponent";

export const isPeaceful = (entity: Entity) => {
  return hasComponentByType(entity, PeacefulComponent);
};

export const isHostile = (entity: Entity) => {
  return hasComponentByType(entity, HostileComponent);
};
