import type { Entity } from "../../../core/model/Entity"
import type { Action } from "../actions/action"
import { triggerOnInspectCurse } from "../curse/triggers/triggerOnInspectCurse"
import { getEntityLogProjection } from "../log/getEntityLogProjection"
import { increaseInspected } from "./inspect"

export const inspectItem = (action: Action, item: Entity): void => {
  increaseInspected(item)
  action.info("INSPECT.ITEM", getEntityLogProjection(item))
  triggerOnInspectCurse(action, item)
}
