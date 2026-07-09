import type { Entity } from "../../../core/ecs/Entity";
import { hasComponentsByType } from "../../../core/ecs/queries/components/has";
import { patchComponentByType } from "../../../core/ecs/queries/components/patch";
import { ExpComponent } from "../../model/components/mobs/ExpComponent";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import { EXP } from "./expTable";

export const addExp = (entity: Entity | undefined, exp: number): void => {
  if (!entity) throw new Error("Cannot add exp to undefined entity.");

  patchComponentByType(entity, ExpComponent, (expComponent) => {
    expComponent.exp += exp;
  });
};

export const addExplorationExp = (
  floor: Entity,
  player: Entity | undefined,
): Entity => {
  if (!player) throw new Error("Cannot add exp to undefined player.");

  if (!hasComponentsByType(floor, VisitedComponent)) {
    addExp(player, EXP.VISITED_TILE);
  }
  return player;
};
