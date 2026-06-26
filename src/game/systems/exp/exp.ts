import type { Entity } from "../../../core/ecs/Entity";
import {
  hasComponentByType,
  patchComponentByType,
} from "../../../core/ecs/queries/component";
import { ExpComponent } from "../../model/components/mobs/ExpComponent";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import type { FloorEntity } from "../../model/entities/FloorEntity";
import type { PlayerEntity } from "../../model/entities/PlayerEntity";
import { EXP } from "./expTable";

export const addExp = (entity: Entity | undefined, exp: number): void => {
  if (!entity) throw new Error("Cannot add exp to undefined entity.");

  patchComponentByType(entity, ExpComponent, (expComponent) => {
    expComponent.exp += exp;
    return expComponent;
  });
};

export const addExplorationExp = (
  floor: FloorEntity,
  player: PlayerEntity | undefined,
): PlayerEntity => {
  if (!player) throw new Error("Cannot add exp to undefined player.");

  if (!hasComponentByType(floor, VisitedComponent)) {
    addExp(player, EXP.VISITED_TILE);
  }
  return player;
};
