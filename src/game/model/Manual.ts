import type { Entity } from "../../core/model/Entity"
import type { Action } from "../systems/actions/action"

export type Manual<EntityValue = Entity> = {
  onAfterTakeDamage?: (gameAction: Action, entity: EntityValue) => void
  onDie?: (gameAction: Action, entity: EntityValue) => void
  beforeAttack?: (
    gameAction: Action,
    source: EntityValue,
    entity: EntityValue,
  ) => void
  onAttack?: (
    gameAction: Action,
    source: EntityValue,
    entity: EntityValue,
  ) => void
  getAttackWeapon?: (entity: EntityValue) => Entity
  curse?: (gameAction: Action, item: EntityValue) => void
  shouldBeCursed?: (item: EntityValue) => boolean
  afterPoke?: (
    gameAction: Action,
    source: EntityValue,
    target: EntityValue,
  ) => void
  disable?: (gameAction: Action, entity: EntityValue) => void
  canAdd?: (parent: EntityValue, child: EntityValue) => boolean
}
