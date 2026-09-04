import type { Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { PierceComponent } from "../../model/components/PierceComponent";

export const canPierce = (entity: Entity): boolean =>
  hasComponentsByType(entity, PierceComponent);

export const getPierceRange = (entity: Entity): number =>
  getComponentByType(entity, PierceComponent)?.pierce ??
  PierceComponent.defaults.pierce;
