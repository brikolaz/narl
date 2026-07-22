import { upsertComponents } from "../../../core/ecs/queries/components/add";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import { getTile } from "../../model/queries/tile";

export const markAsVisited = (position: number): void => {
  upsertComponents(getTile(position).floor, VisitedComponent());
};
