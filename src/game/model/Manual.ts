import type { Entity } from "../../core/ecs/Entity";
import type { Action } from "../systems/actions/action";

export type Manual<T = Entity> = {
  onAfterTakeDamage?: (
    entity: T,
    gameAction: Action,
  ) => void;
  getEquippedWeapon?: (entity: T) => Entity;
  curse?: (item: T) => void;
  shouldBeCursed?: (item: T) => boolean;
  poke?: (entity: T, gameAction: Action) => void;
};
