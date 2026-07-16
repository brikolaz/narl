import { upsertComponents } from "../../../core/ecs/queries/components/add";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import type { GameState } from "../../state/state";

export const markAsVisited = (state: GameState, position: number): void => {
  upsertComponents(state.world[position].floor, VisitedComponent());
};