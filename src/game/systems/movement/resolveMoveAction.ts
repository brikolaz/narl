import { produce } from "immer";
import { upsertComponent } from "../../../core/ecs/queries/component";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import { getPlayerPosition } from "../../state/selectors/player";
import type { GameState, Tile } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { hasMobs } from "../attack/mobs";
import { addExplorationExp } from "../exp/exp";
import { PlayerActionType, type PlayerMoveAction } from "../player/types";
import { getNextPlayerPosition } from "./getNextPlayerPosition";

const markAsVisited = (state: GameState, position: number): void => {
  upsertComponent(state.world[position].floor, new VisitedComponent());
};

const getNextState = (
  state: GameState,
  currentPlayerPosition: number,
  nextPlayerPosition: number,
): void => {
  const world = state.world;
  const player = world[currentPlayerPosition].player;
  const oldPlayerTile: Tile = {
    floor: world[currentPlayerPosition].floor,
    items: world[currentPlayerPosition].items,
    player: undefined,
    mobs: world[currentPlayerPosition].mobs,
  };
  const newPlayerTile: Tile = {
    floor: world[nextPlayerPosition].floor,
    items: world[nextPlayerPosition].items,
    player: addExplorationExp(world[nextPlayerPosition].floor, player),
    mobs: world[nextPlayerPosition].mobs,
  };
  world[currentPlayerPosition] = oldPlayerTile;
  world[nextPlayerPosition] = newPlayerTile;
  markAsVisited(state, nextPlayerPosition);
};

export const resolveMoveAction = (
  state: GameState,
  { direction }: PlayerMoveAction,
): ActionResolution => {
  const action = new Action();
  const nextState = produce(state, (draft) => {
    const currentPlayerPosition = getPlayerPosition(draft);
    const nextPlayerPosition = getNextPlayerPosition({
      currentPosition: currentPlayerPosition,
      direction,
    });

    if (nextPlayerPosition === null) {
      return action.fail(`Cannot move ${direction.toLowerCase()}`);
    }
    if (hasMobs(draft.world[nextPlayerPosition])) {
      return action.addPending({
        type: PlayerActionType.ATTACK,
        targetPosition: nextPlayerPosition,
      });
    }

    getNextState(draft, currentPlayerPosition, nextPlayerPosition);
    action.success(`Moved ${direction.toLowerCase()}`);
  });

  return action.resolve(nextState);
};
