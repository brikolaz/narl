import { getComponentByType } from "../../../core/model/queries/components/get";
import type { EntityArgument } from "../../../core/model/queries/entities/normalize";
import { PositionComponent } from "../components/PositionComponent";

export const getPosition = (entity?: EntityArgument) => {
  return (
    getComponentByType(entity, PositionComponent)?.position ??
    PositionComponent.defaults.position
  );
};
