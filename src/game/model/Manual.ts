import type { Entity } from "../../core/ecs/Entity";
import type { GameState } from "../state/state";
import type { Action } from "../systems/actions/action";

export type Manual<T> = {
  onAfterTakeDamage?: (
    entity: T,
    gameState: GameState,
    gameAction: Action,
  ) => void;
  getEquippedWeapon?: (entity: T) => Entity;
};
