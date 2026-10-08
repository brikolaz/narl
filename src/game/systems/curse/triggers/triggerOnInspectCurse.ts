import type { Entity } from "../../../../core/model/Entity"
import type { Action } from "../../actions/action"
import { applyAssableCurse } from "../curses/applyAssableCurse"

export const triggerOnInspectCurse = (action: Action, item: Entity) => {
  applyAssableCurse(action, item)
}
