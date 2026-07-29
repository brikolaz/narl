import type { Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { PositionComponent } from "../components/PositionComponent";

export const getPosition = (entity: Entity) => {
  return (
    getComponentByType(entity, PositionComponent)?.position ??
    PositionComponent.defaults.position
  );
};
