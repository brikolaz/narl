import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/components/get";
import { PositionComponent } from "../components/PositionComponent";

export const getPosition = (entity: Entity) => {
  return (
    getComponentByType(entity, PositionComponent)?.position ??
    PositionComponent.defaults.position
  );
};
