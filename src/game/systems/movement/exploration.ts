import { upsertComponents } from "../../../core/model/queries/components/add"
import { VisitedComponent } from "../../model/components/state/VisitedComponent"
import { getTile } from "../world/tile"

export const markAsVisited = (position: number): void => {
  upsertComponents(getTile(position).floor, VisitedComponent())
}
