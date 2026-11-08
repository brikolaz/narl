import type { Entity } from "../../../../core/model/Entity"
import type { Action } from "../../actions/action"
import { applyWokeCurse } from "../curses/applyWokeCurse"

export const triggerOnPokeCurse = (
  action: Action,
  source: Entity,
  target: Entity,
) => {
  applyWokeCurse(action, source, target)
}
