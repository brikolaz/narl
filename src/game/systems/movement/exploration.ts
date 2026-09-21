import { upsertComponents } from "../../../core/model/queries/components/add"
import { hasComponentsByType } from "../../../core/model/queries/components/has"
import { VisitedComponent } from "../../model/components/state/VisitedComponent"
import { getTile } from "../world/tile"

export const markAsVisited = (position: number): void => {
  const floor = getTile(position).floor
  if (hasComponentsByType(floor, VisitedComponent)) {
    return
  }

  upsertComponents(floor, VisitedComponent())
}
