import type { Entity } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { getComponentsByType } from "../../../core/model/queries/components/get";
import { removeComponents } from "../../../core/model/queries/components/remove";
import { PositionComponent } from "../../model/components/PositionComponent";

export const setPosition = (entity: Entity, position: number) => {
  removeComponents(...getComponentsByType(entity, PositionComponent));
  upsertComponents(entity, PositionComponent({ position }));
};
