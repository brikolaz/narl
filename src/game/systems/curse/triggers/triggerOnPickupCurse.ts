import type { Entity } from "../../../../core/model/Entity"
import type { Action } from "../../actions/action"
import { applyOffensiveContainerCurse } from "../curses/applyOffensiveContainerCurse"

export const triggerOnPickupCurse = (action: Action, item: Entity) => {
  applyOffensiveContainerCurse(action, item)
}
