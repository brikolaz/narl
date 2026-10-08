import type { Entity } from "../../../../core/model/Entity"
import type { Action } from "../../actions/action"
import { applySeverCockCurse } from "../curses/applySeverCockCurse"

export const triggerOnEquipCurse = (
  action: Action,
  target: Entity,
  slot: Entity,
  item: Entity,
) => {
  applySeverCockCurse(action, target, slot, item)
}
