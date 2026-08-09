import type { Entity } from "../../core/model/Entity";
import type { Action } from "../systems/actions/action";

export type Manual<T = Entity> = {
  onAfterTakeDamage?: (gameAction: Action, entity: T) => void;
  onAttack?: (gameAction: Action, source: T, entity: T) => void;
  getAttackWeapon?: (entity: T) => Entity;
  curse?: (gameAction: Action, item: T) => void;
  shouldBeCursed?: (item: T) => boolean;
  poke?: (gameAction: Action, entity: T) => void;
  disable?: (gameAction: Action, entity: T) => void;
  canAdd?: (parent: T, child: T) => boolean;
};
