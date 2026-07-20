import { upsertComponents } from "../../../core/ecs/queries/components/add";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import { STATE } from "../../state/state";

export const markAsVisited = (position: number): void => {
  upsertComponents(STATE.world[position].floor, VisitedComponent());
};
