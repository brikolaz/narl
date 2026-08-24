import type { Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { FovComponent } from "../../model/components/FovComponent";
import { getPosition } from "../../model/queries/position";

const getFovRange = (entity: Entity) => {
  return (
    getComponentByType(entity, FovComponent)?.range ??
    FovComponent.defaults.range
  );
};
export const inFov = (source: Entity, target: Entity) => {
  const fov = getFovRange(source);
  const targetPosition = getPosition(target);
  const sourcePosition = getPosition(source);

  return Math.abs(targetPosition - sourcePosition) <= fov;
};
